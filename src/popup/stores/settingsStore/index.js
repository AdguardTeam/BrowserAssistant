import {
    action,
    computed,
    makeObservable,
    observable,
    runInAction,
} from 'mobx';

import {
    ORIGINAL_CERT_STATUS,
    PROTOCOLS,
    SWITCHER_TRANSITION_TIME,
} from '../consts';
import {
    DOWNLOAD_LINK,
    EXTENSION_DOWNLOAD_LINK,
    SUPPORT_LINK,
} from '../../../lib/consts';
import { tabs } from '../../../lib/tabs';
import { messagesSender } from '../../messageService';
import {
    getFormattedProtocol,
    getUrlProps,
    isExtensionProtocol,
} from '../../../lib/helpers';
import log from '../../../lib/logger';

class SettingsStore {
    constructor(rootStore) {
        makeObservable(this);
        this.rootStore = rootStore;
    }

    @observable currentUrl = '';

    @observable currentTitle = '';

    @observable referrer = '';

    @observable originalCertIssuer = '';

    @observable isPageFilteredByUserFilter = false;

    @observable isHttpsFilteringEnabled = false;

    @observable isFilteringEnabled = false;

    @observable canChangeFilteringStatus = true;

    @observable isInstalled = false;

    @observable isRunning = false;

    @observable isProtectionEnabled = false;

    @observable isLicenseExpired = false;

    @observable originalCertStatus = ORIGINAL_CERT_STATUS.VALID;

    @observable isAppUpToDate = false;

    @observable isValidatedOnHost = false;

    @observable isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;

    @observable isAuthorized = false;

    @observable hostError = null;

    @observable filteringPauseTimeout = 0;

    @observable isFilteringPauseSupported = false;

    @observable showReloadButtonFlag = false;

    @observable consentRequired = true;

    @observable loadingConsent = true;

    @computed
    get filteringPauseTimer() {
        const filteringPauseTimeoutSec = (this.filteringPauseTimeout / 1000).toString(10);
        return `00:${filteringPauseTimeoutSec.padStart(2, '0')}`;
    }

    @computed
    get shouldShowFilteringPauseTimer() {
        return this.filteringPauseTimeout > 0;
    }

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
    setFilteringPauseSupported = (isFilteringPauseSupported) => {
        this.isFilteringPauseSupported = isFilteringPauseSupported;
    };

    @action
    setFilteringPauseTimeout = async (filteringPauseTimeout) => {
        runInAction(() => {
            this.filteringPauseTimeout = filteringPauseTimeout;
        });
        const tab = await this.getCurrentTab();
        await this.updatePopupData(tab);
    };

    @action
    setShowReloadButtonFlag = (showReloadButtonFlag) => {
        this.showReloadButtonFlag = showReloadButtonFlag;
    };

    @action
    setUpdateStatusInfo = (statusInfo) => {
        const { isAppUpToDate, isValidatedOnHost } = statusInfo;

        this.isAppUpToDate = isAppUpToDate;
        this.isValidatedOnHost = isValidatedOnHost;
    };

    @action
    updatePopupData = async (tab) => {
        const currentTab = tab || await this.getCurrentTab();
        const popupData = await messagesSender.getPopupData(currentTab);
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
            isFilteringPauseSupported,
            showReloadButtonFlag,
        } = popupData;

        runInAction(() => {
            this.referrer = referrer;
            this.setUrlFilteringState(currentFilteringState);
            this.setCurrentAppState(appState);
            this.setUpdateStatusInfo(updateStatusInfo);
            this.setFilteringPauseSupported(isFilteringPauseSupported);
            this.setShowReloadButtonFlag(showReloadButtonFlag);
        });
    };

    @action
    setConsentRequired = (consentRequired) => {
        this.loadingConsent = false;
        this.consentRequired = consentRequired;
    };

    @action
    setLoadingConsent = (state) => {
        this.loadingConsent = state;
    };

    @action
    getPopupData = async () => {
        // first check consent
        this.setLoadingConsent(true);
        const consentRequired = await messagesSender.getConsentRequired();
        this.setConsentRequired(consentRequired);
        this.setLoadingConsent(false);
        if (consentRequired) {
            return;
        }

        // second get locale to show messages as faster as possible,
        // for consent screen it is not important as it uses browser locale
        const locale = await messagesSender.getLocale();
        this.rootStore.translationStore.setLocale(locale);
        this.rootStore.uiStore.setExtensionLoading(true);
        const tab = await this.getCurrentTab();
        await this.updatePopupData(tab);

        runInAction(() => {
            this.currentUrl = tab.url;
            this.currentTitle = tab.title;
            // Stop showing loading screen only when all popup data is received
            this.rootStore.uiStore.setExtensionLoading(false);
        });
    };

    @action
    openDownloadPage = async () => {
        await tabs.openPage(DOWNLOAD_LINK);
    };

    /**
     * Reloads current tab
     * @returns {Promise<void>}
     */
    reloadCurrentTab = async () => {
        const tab = await tabs.getCurrentTab();
        await tabs.reloadTab(tab);
    };

    /**
     * Reloads active and similar tabs
     * @returns {Promise<void>}
     */
    reloadActiveAndSimilarTabs = async () => {
        const tabsToReload = await tabs.getActiveAndSimilarTabs();
        tabsToReload.forEach((tab) => {
            tabs.reloadTab(tab);
        });
    };

    reloadPageAfterSwitcherTransition = () => {
        setTimeout(async () => {
            await this.reloadActiveAndSimilarTabs();
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
            canChangeFilteringStatus,
        } = currentFilteringState;

        this.isFilteringEnabled = isFilteringEnabled;
        this.isHttpsFilteringEnabled = isHttpsFilteringEnabled;
        this.originalCertStatus = ORIGINAL_CERT_STATUS[originalCertStatus.toUpperCase()];
        this.originalCertIssuer = originalCertIssuer;
        this.isPageFilteredByUserFilter = isPageFilteredByUserFilter;
        this.canChangeFilteringStatus = canChangeFilteringStatus;
    };

    @action
    setCurrentAppState = (appState) => {
        const {
            isInstalled,
            isRunning,
            isProtectionEnabled,
            isLicenseExpired,
            locale,
            isAuthorized,
        } = appState;
        this.isInstalled = isInstalled;
        this.isProtectionEnabled = isProtectionEnabled;
        this.isLicenseExpired = isLicenseExpired;
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
        tabs.openPage(EXTENSION_DOWNLOAD_LINK);
    };

    /**
     * Starts assistant
     */
    initAssistant = async () => {
        const tab = await this.getCurrentTab();
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
        const tab = await tabs.getCurrentTab();
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

    contactSupport = async () => {
        try {
            await tabs.openPage(SUPPORT_LINK);
            window.close();
        } catch (error) {
            log.error(error);
        }
    };

    removeCustomRules = async () => {
        const { uiStore } = this.rootStore;
        try {
            uiStore.setExtensionPending(true);
            const tab = await this.getCurrentTab();
            await messagesSender.removeCustomRules(this.currentUrl);
            const urlFilteringState = await messagesSender.getUrlFilteringState(tab);
            this.setUrlFilteringState(urlFilteringState);
            uiStore.setExtensionPending(false);

            await this.reloadActiveAndSimilarTabs();
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
                this.isHttpsFilteringEnabled,
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
            const tab = await this.getCurrentTab();
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

    pauseFiltering = async () => {
        this.setShowReloadButtonFlag(false);
        const tab = await this.getCurrentTab();
        await messagesSender.pauseFiltering(tab);
        const filteringStatus = await messagesSender.getUrlFilteringState(tab);
        this.setUrlFilteringState(filteringStatus);
    };

    @computed
    get hasHostError() {
        return this.hostError !== null;
    }
}

export default SettingsStore;
