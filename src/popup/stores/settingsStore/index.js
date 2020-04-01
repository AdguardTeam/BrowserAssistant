import {
    action, computed, observable, runInAction,
} from 'mobx';
import { ORIGINAL_CERT_STATUS, PROTOCOLS } from '../consts';
import { DOWNLOAD_LINK, UPDATE_URL_CHROME, UPDATE_URL_FIREFOX } from '../../../lib/consts';
import innerMessaging from '../../../lib/innerMessaging'; // TODO consider rename of this
import tabs from '../../../background/tabs';
import { getUrlProps } from '../../../lib/helpers';
import log from '../../../lib/logger';

class SettingsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable currentUrl = '';

    @observable referrer = '';

    @observable originalCertIssuer = '';

    @observable isHttpsFilteringEnabled = false;

    @observable isFilteringEnabled = false;

    @observable isInstalled = true;

    @observable isRunning = true;

    @observable isProtectionEnabled = true;

    @observable originalCertStatus = ORIGINAL_CERT_STATUS.VALID;

    @observable isAppUpToDate = true;

    @observable isValidatedOnHost = true;

    @observable isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;

    @observable isAuthorized = true;

    @computed
    get currentTabHostname() {
        return getUrlProps(this.currentUrl).hostname;
    }

    @computed
    get currentPort() {
        return getUrlProps(this.currentUrl).port;
    }

    @computed
    get currentProtocol() {
        return getUrlProps(this.currentUrl).protocol;
    }

    @computed get pageProtocol() {
        return ({
            isHttp: this.currentProtocol === PROTOCOLS.HTTP,
            isHttps: this.currentProtocol === PROTOCOLS.HTTPS,
            isSecured: this.currentProtocol === PROTOCOLS.SECURED,
        });
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
        const tab = await tabs.getCurrent();
        const popupData = await innerMessaging.getPopupData(tab);

        const {
            referrer,
            currentFilteringState,
            updateStatusInfo,
            appState,
        } = popupData;

        this.setUrlFilteringState(currentFilteringState);

        this.setUpdateStatusInfo(updateStatusInfo);

        this.rootStore.translationStore.setLocale(appState.locale);

        runInAction(() => {
            this.currentUrl = tab.url;
            this.referrer = referrer;
        });
    };

    @action
    openDownloadPage = () => {
        innerMessaging.openPage(DOWNLOAD_LINK);
    };

    @action
    setHttpsFiltering = async (isHttpsFilteringEnabled) => {
        this.isHttpsFilteringEnabled = isHttpsFilteringEnabled;
        await this.rootStore.requestsStore.setFilteringStatus();
        this.rootStore.uiStore.reloadPageAfterSwitcherTransition();
    };

    @action
    setFiltering = async (isFilteringEnabled) => {
        this.isFilteringEnabled = isFilteringEnabled;
        await this.rootStore.requestsStore.setFilteringStatus();
        this.rootStore.uiStore.reloadPageAfterSwitcherTransition();
    };

    @action
    setInstalled = (isInstalled) => {
        this.isInstalled = isInstalled;
    };

    @action
    setUrlFilteringState = (parameters) => {
        const {
            isFilteringEnabled,
            isHttpsFilteringEnabled,
            originalCertStatus,
            isPageFilteredByUserFilter,
            originalCertIssuer,
        } = parameters;

        this.isFilteringEnabled = isFilteringEnabled;
        this.isHttpsFilteringEnabled = isHttpsFilteringEnabled;
        this.originalCertStatus = ORIGINAL_CERT_STATUS[originalCertStatus.toUpperCase()];
        this.originalCertIssuer = originalCertIssuer;
        this.rootStore.uiStore.setPageFilteredByUserFilter(isPageFilteredByUserFilter);
    };

    @action
    setCurrentAppState = (appState) => {
        const {
            isInstalled, isRunning, isProtectionEnabled, locale, isAuthorized,
        } = appState;
        this.isInstalled = isInstalled;
        this.isProtectionEnabled = isProtectionEnabled;
        this.isRunning = isRunning;
        this.isAuthorized = isAuthorized; // TODO check that isAuthorized is not broken
        this.rootStore.translationStore.setLocale(locale);
    };

    @action
    updateExtension = () => {
        const updateLink = this.isFirefox ? UPDATE_URL_FIREFOX : UPDATE_URL_CHROME;
        innerMessaging.openPage(updateLink);
    };

    /**
     * Starts assistant
     */
    startBlockingAd = async () => {
        const tab = await tabs.getCurrent();
        await innerMessaging.initAssistant(tab.id);
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
            uiStore.setExtensionLoading(true);
            const response = await innerMessaging.setProtectionStatus(isEnabled);
            uiStore.setExtensionLoading(false);
            await this.setCurrentAppState(response.appState);
            uiStore.setProtectionTogglePending(false);
        } catch (error) {
            // TODO handle error correctly
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

    @action updateUrlFilteringState = async () => {
        const tab = await this.getCurrentTab();
        const response = await innerMessaging.getUrlFilteringState(tab);
        this.setUrlFilteringState(response);
    };

    @action
    enableApp = async () => {
        const { uiStore } = this.rootStore;
        uiStore.setExtensionLoading(true);

        const appState = await innerMessaging.setProtectionStatus(true);
        this.setCurrentAppState(appState);
        await this.updateUrlFilteringState();

        uiStore.setExtensionLoading(false);
    }
}

export default SettingsStore;
