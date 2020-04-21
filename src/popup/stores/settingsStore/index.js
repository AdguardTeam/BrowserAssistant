import {
    action,
    computed,
    observable,
    runInAction,
} from 'mobx';
import { ORIGINAL_CERT_STATUS, PROTOCOLS, SWITCHER_TRANSITION_TIME } from '../consts';
import { DOWNLOAD_LINK, EXTENSION_DOWNLOAD_LINK } from '../../../lib/consts';
import messagesSender from '../../messaging/sender';
import tabs from '../../../background/tabs';
import { getFormattedProtocol, getUrlProps, isExtensionProtocol } from '../../../lib/helpers';
import log from '../../../lib/logger';

class SettingsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable currentUrl = '';

    @observable currentTitle = '';

    @observable referrer = '';

    @observable originalCertIssuer = '';

    @observable isPageFilteredByUserFilter = false;

    @observable isHttpsFilteringEnabled = false;

    @observable isFilteringEnabled = false;

    @observable isInstalled = false;

    @observable isRunning = false;

    @observable isProtectionEnabled = false;

    @observable originalCertStatus = ORIGINAL_CERT_STATUS.VALID;

    @observable isAppUpToDate = false;

    @observable isValidatedOnHost = false;

    @observable isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;

    @observable isAuthorized = false;

    @observable hostError = null;

    @computed
    get currentTabHostname() {
        return getUrlProps(this.currentUrl).hostname || this.currentUrl;
    }

    @computed
    get currentPort() {
        return getUrlProps(this.currentUrl).port;
    }

    @computed
    get currentProtocol() {
        const { protocol } = getUrlProps(this.currentUrl);
        return getFormattedProtocol(protocol);
    }

    @computed get pageProtocol() {
        const { protocol } = getUrlProps(this.currentUrl);
        return ({
            isHttp: this.currentProtocol === PROTOCOLS.HTTP,
            isHttps: this.currentProtocol === PROTOCOLS.HTTPS,
            isSecured: this.currentProtocol === PROTOCOLS.SECURED,
            isExtension: this.currentProtocol === PROTOCOLS.SECURED
                && isExtensionProtocol(protocol),
        });
    }

    @computed get pageInfo() {
        return this.pageProtocol.isExtension ? this.currentTitle : this.currentTabHostname;
    }

    @action
    setUpdateStatusInfo = (statusInfo) => {
        const {
            isAppUpToDate, isValidatedOnHost,
        } = statusInfo;

        this.isAppUpToDate = isAppUpToDate;
        this.isValidatedOnHost = isValidatedOnHost;
    };

    @action
    getPopupData = async () => {
        // Get locale at the beginning in order to show messages as faster as possible
        const locale = await messagesSender.getLocale();
        this.rootStore.translationStore.setLocale(locale);
        this.rootStore.uiStore.setExtensionLoading(true);
        const tab = await tabs.getCurrent();
        const popupData = await messagesSender.getPopupData(tab);

        if (popupData.hostError) {
            runInAction(() => {
                this.hostError = popupData.hostError;
                this.rootStore.uiStore.setExtensionLoading(false);
            });
            return;
        }

        const {
            referrer,
            currentFilteringState,
            updateStatusInfo,
            appState,
        } = popupData;

        runInAction(() => {
            this.currentUrl = tab.url;
            this.currentTitle = tab.title;
            this.referrer = referrer;
            this.setUrlFilteringState(currentFilteringState);
            this.setCurrentAppState(appState);
            this.setUpdateStatusInfo(updateStatusInfo);
            this.rootStore.uiStore.setExtensionLoading(false);
        });
    };

    @action
    openDownloadPage = async () => {
        await messagesSender.openPage(DOWNLOAD_LINK);
    };

    reloadPageAfterSwitcherTransition = () => {
        setTimeout(async () => {
            const tab = await this.getCurrentTab();
            await messagesSender.reload(tab);
        }, SWITCHER_TRANSITION_TIME);
    };

    @action
    setHttpsFiltering = async (isHttpsFilteringEnabled) => {
        this.isHttpsFilteringEnabled = isHttpsFilteringEnabled;
        await this.setFilteringStatus();
        this.reloadPageAfterSwitcherTransition();
    };

    @action
    setFiltering = async (isFilteringEnabled) => {
        this.isFilteringEnabled = isFilteringEnabled;
        await this.setFilteringStatus();
        this.reloadPageAfterSwitcherTransition();
    };

    @action
    setInstalled = (isInstalled) => {
        this.isInstalled = isInstalled;
    };

    @action
    setUrlFilteringState = (currentFilteringState) => {
        if (!currentFilteringState) {
            return;
        }

        const {
            isFilteringEnabled,
            isHttpsFilteringEnabled,
            originalCertStatus,
            isPageFilteredByUserFilter,
            originalCertIssuer,
        } = currentFilteringState;

        this.isFilteringEnabled = isFilteringEnabled;
        this.isHttpsFilteringEnabled = isHttpsFilteringEnabled;
        this.originalCertStatus = ORIGINAL_CERT_STATUS[originalCertStatus.toUpperCase()];
        this.originalCertIssuer = originalCertIssuer;
        this.isPageFilteredByUserFilter = isPageFilteredByUserFilter;
    };

    @action
    setCurrentAppState = (appState) => {
        const {
            isInstalled, isRunning, isProtectionEnabled, locale, isAuthorized,
        } = appState;
        this.isInstalled = isInstalled;
        this.isProtectionEnabled = isProtectionEnabled;
        this.isRunning = isRunning;
        this.isAuthorized = isAuthorized;
        this.rootStore.translationStore.setLocale(locale);
    };

    @computed
    get isAppWorking() {
        return [
            this.isInstalled,
            this.isRunning,
            this.isProtectionEnabled,
            this.isAppUpToDate,
            this.isValidatedOnHost,
        ].every((state) => state === true);
    }

    @action
    updateExtension = () => {
        messagesSender.openPage(EXTENSION_DOWNLOAD_LINK);
    };

    /**
     * Starts assistant
     */
    initAssistant = async () => {
        const tab = await tabs.getCurrent();
        await messagesSender.initAssistant(tab.id);
        window.close();
    };

    /**
     * Switches protection status
     * @param {boolean} isEnabled
     * @returns {Promise<void>}
     */
    setProtectionStatus = async (isEnabled) => {
        const { uiStore } = this.rootStore;
        try {
            uiStore.setExtensionPending(true);
            const tab = await this.getCurrentTab();
            const appState = await messagesSender.setProtectionStatus(isEnabled);
            const urlFilteringState = await messagesSender.getUrlFilteringState(tab);
            runInAction(async () => {
                this.setCurrentAppState(appState);
                this.setUrlFilteringState(urlFilteringState);
                uiStore.setExtensionPending(false);
            });
        } catch (error) {
            log.error(error);
        }
    };

    @action
    getCurrentTab = async () => {
        const tab = await tabs.getCurrent();
        runInAction(() => {
            // update current url just in case
            this.currentUrl = tab.url;
        });
        return tab;
    };

    openFilteringLog = async () => {
        try {
            await messagesSender.openFilteringLog();
            window.close();
        } catch (error) {
            log.error(error);
        }
    };

    reportSite = async () => {
        try {
            await messagesSender.reportSite(this.currentUrl, this.referrer);
            window.close();
        } catch (error) {
            log.error(error);
        }
    };

    removeCustomRules = async () => {
        const { uiStore } = this.rootStore;
        try {
            uiStore.setExtensionPending(true);
            const tab = await tabs.getCurrent();
            await messagesSender.removeCustomRules(this.currentUrl);
            const urlFilteringState = await messagesSender.getUrlFilteringState(tab);
            runInAction(async () => {
                this.setUrlFilteringState(urlFilteringState);
                uiStore.setExtensionPending(false);
                await messagesSender.reload(tab);
            });
        } catch (error) {
            log.error(error);
        }
    };

    openSettings = async () => {
        try {
            await messagesSender.openSettings();
            window.close();
        } catch (error) {
            log.error(error);
        }
    };

    openOriginalCert = async () => {
        const { hostname, port } = getUrlProps(this.currentUrl);

        try {
            await messagesSender.openOriginalCert(hostname, port);
        } catch (error) {
            log.error(error);
        }
    };

    setFilteringStatus = async () => {
        try {
            await messagesSender.setFilteringStatus(
                this.currentUrl,
                this.isFilteringEnabled,
                this.isHttpsFilteringEnabled
            );
        } catch (error) {
            log.error(error);
        }
    };

    updateApp = async () => {
        try {
            await messagesSender.updateApp();
        } catch (error) {
            log.error(error);
        }
    };

    startApp = async () => {
        try {
            this.rootStore.uiStore.setExtensionPending(true);
            const tab = await tabs.getCurrent();
            const currentFilteringState = await messagesSender.getUrlFilteringState(tab, true);
            const response = await messagesSender.getAppState();
            runInAction(() => {
                this.setUrlFilteringState(currentFilteringState);
                this.setCurrentAppState(response.appState);
                this.setUpdateStatusInfo(response.updateStatusInfo);
                this.rootStore.uiStore.setExtensionPending(false);
            });
        } catch (error) {
            log.error(error);
        }
    };

    @computed
    get hasHostError() {
        return this.hostError !== null;
    }
}

export default SettingsStore;
