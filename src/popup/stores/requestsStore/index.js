import { action } from 'mobx';
import log from '../../../lib/logger';
import { INDICATE_LOADING_START_TIME } from '../consts';

class RequestsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @action
    getCurrentFilteringState = async (forceStartApp = false) => {
        const { currentURL, currentPort } = this.rootStore.settingsStore;
        this.rootStore.uiStore.setExtensionLoading(true);
        try {
            await adguard.requests.getCurrentFilteringState(currentURL, currentPort, forceStartApp);
        } catch (error) {
            log.error(error);
        }
    };

    @action
    getCurrentAppState = async () => {
        this.rootStore.uiStore.setExtensionLoading(true);
        try {
            await adguard.requests.getCurrentAppState();
        } catch (error) {
            log.error(error);
        }
    };

    @action
    setFilteringStatus = async () => {
        const {
            currentURL, isFilteringEnabled,
            isHttpsFilteringEnabled,
        } = this.rootStore.settingsStore;
        this.rootStore.uiStore.setExtensionLoading(true);
        try {
            await adguard.requests.setFilteringStatus({
                url: currentURL,
                isEnabled: isFilteringEnabled,
                isHttpsEnabled: isHttpsFilteringEnabled,
            });
        } catch (error) {
            log.error(error);
        }
    };

    @action
    openOriginalCert = async () => {
        const {
            settingsStore: { currentTabHostname, currentPort },
            uiStore: { setExtensionLoading },
        } = this.rootStore;

        setExtensionLoading(true);
        setTimeout(() => setExtensionLoading(false), INDICATE_LOADING_START_TIME);

        try {
            await adguard.requests.openOriginalCert(currentTabHostname, currentPort);
        } catch (error) {
            log.error(error);
        }
    };

    @action
    removeCustomRules = async () => {
        this.rootStore.uiStore.setExtensionLoading(true);
        try {
            await adguard.requests.removeCustomRules(this.rootStore.settingsStore.currentURL);
            this.rootStore.uiStore.setPageFilteredByUserFilter(false);
        } catch (error) {
            log.error(error);
        }
    };

    @action
    reportSite = async () => {
        const { currentURL, referrer } = this.rootStore.settingsStore;
        this.rootStore.uiStore.setExtensionLoading(true);
        try {
            await adguard.requests.reportSite({
                url: currentURL,
                referrer,
            });
        } catch (error) {
            log.error(error);
        }
    };

    @action
    openFilteringLog = async () => {
        this.rootStore.uiStore.setExtensionLoading(true);
        try {
            await adguard.requests.openFilteringLog();
        } catch (error) {
            log.error(error);
        }
    };

    @action
    removeRule = async () => {
        try {
            await adguard.requests.removeRule(
                this.rootStore.settingsStore.currentTabHostname
            );
        } catch (error) {
            log.error(error);
        }
    };

    @action
    addRule = async () => {
        try {
            await adguard.requests.addRule(
                this.rootStore.settingsStore.currentTabHostname
            );
        } catch (error) {
            log.error(error);
        }
    };

    @action
    setProtectionStatus = async (shouldEnableProtection) => {
        this.rootStore.uiStore.setExtensionLoading(true);
        try {
            const response = await adguard.requests.setProtectionStatus(shouldEnableProtection);
            this.rootStore.settingsStore.setProtection(response.appState.isProtectionEnabled);
            this.rootStore.uiStore.setProtectionTogglePending(false);
        } catch (error) {
            log.error(error);
        }
    };

    @action
    startApp = async () => {
        this.rootStore.uiStore.setExtensionLoading(true);
        try {
            await this.getCurrentFilteringState(true);
        } catch (error) {
            log.error(error);
        }
    };

    @action
    updateApp = async () => {
        this.rootStore.uiStore.setExtensionLoading(true);
        try {
            await adguard.requests.updateApp();
        } catch (error) {
            log.error(error);
        }
    };

    @action
    openSettings = async () => {
        this.rootStore.uiStore.setExtensionLoading(true);
        try {
            await adguard.requests.openSettings();
        } catch (error) {
            log.error(error);
        }
    };

    @action
    startBlockingAd = async () => {
        this.rootStore.uiStore.setExtensionLoading(true);
        try {
            await adguard.tabs.initAssistant();
        } catch (error) {
            log.error(error);
        }
        window.close();
    };
}

export default RequestsStore;
