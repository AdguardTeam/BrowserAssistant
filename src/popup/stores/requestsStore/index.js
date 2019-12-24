import { action } from 'mobx';
import log from '../../../lib/logger';

class RequestsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @action
    getCurrentFilteringState = async (forceStartApp = false) => {
        const { currentURL, currentPort } = this.rootStore.settingsStore;
        this.rootStore.uiStore.setReloading(true);
        try {
            await adguard.requests.getCurrentFilteringState(currentURL, currentPort, forceStartApp);
        } catch (error) {
            log.error(error.message);
        }
    };

    @action
    getCurrentAppState = async () => {
        this.rootStore.uiStore.setReloading(true);
        try {
            await adguard.requests.getCurrentAppState();
        } catch (error) {
            log.error(error.message);
        }
    };

    @action
    setFilteringStatus = async () => {
        const {
            currentURL, isFilteringEnabled,
            isHttpsFilteringEnabled,
        } = this.rootStore.settingsStore;
        this.rootStore.uiStore.setReloading(true);
        try {
            await adguard.requests.setFilteringStatus({
                url: currentURL,
                isEnabled: isFilteringEnabled,
                isHttpsEnabled: isHttpsFilteringEnabled,
            });
            this.rootStore.uiStore.setPageFilteredByUserFilter(true);
        } catch (error) {
            log.error(error.message);
        }
    };

    @action
    openOriginalCert = async () => {
        const { currentTabHostname, currentPort } = this.rootStore.settingsStore;
        try {
            await adguard.requests.openOriginalCert(currentTabHostname, currentPort);
        } catch (error) {
            this.rootStore.uiStore.setReloading(true);
            log.error(error.message);
        }
    };

    @action
    removeCustomRules = async () => {
        this.rootStore.uiStore.setReloading(true);
        try {
            await adguard.requests.removeCustomRules(this.rootStore.settingsStore.currentURL);
            this.rootStore.uiStore.setPageFilteredByUserFilter(false);
        } catch (error) {
            log.error(error.message);
        }
    };

    @action
    reportSite = async () => {
        this.rootStore.uiStore.setReloading(true);
        try {
            await adguard.requests.reportSite({
                url: this.rootStore.settingsStore.currentURL,
                referrer: this.rootStore.settingsStore.referrer,
            });
        } catch (error) {
            log.error(error.message);
        }
    };

    @action
    openFilteringLog = async () => {
        this.rootStore.uiStore.setReloading(true);
        try {
            await adguard.requests.openFilteringLog();
        } catch (error) {
            log.error(error.message);
        }
    };

    @action
    removeRule = async () => {
        try {
            await adguard.requests.removeRule(
                this.rootStore.settingsStore.currentTabHostname
            );
        } catch (error) {
            log.error(error.message);
        }
    };

    @action
    addRule = async () => {
        try {
            await adguard.requests.addRule(
                this.rootStore.settingsStore.currentTabHostname
            );
        } catch (error) {
            log.error(error.message);
        }
    };

    @action
    setProtectionStatus = async (shouldEnableProtection) => {
        this.rootStore.uiStore.setReloading(true);
        try {
            const response = await adguard.requests.setProtectionStatus(shouldEnableProtection);
            this.rootStore.settingsStore.setProtection(response.appState.isProtectionEnabled);
            this.rootStore.uiStore.setPendingToggleProtection(false);
        } catch (error) {
            log.error(error.message);
        }
    };

    @action
    startApp = async () => {
        this.rootStore.uiStore.setReloading(true);
        try {
            await this.getCurrentFilteringState(true);
        } catch (error) {
            log.error(error.message);
        }
    };

    @action
    updateApp = async () => {
        this.rootStore.uiStore.setReloading(true);
        try {
            await adguard.requests.updateApp();
        } catch (error) {
            log.error(error.message);
        }
    };

    @action
    openSettings = async () => {
        this.rootStore.uiStore.setReloading(true);
        try {
            await adguard.requests.openSettings();
        } catch (error) {
            log.error(error.message);
        }
    };

    @action
    startBlockingAd = async () => {
        this.rootStore.uiStore.setReloading(true);
        try {
            await adguard.tabs.initAssistant();
        } catch (error) {
            log.error(error.message);
        }
        window.close();
    };
}

export default RequestsStore;
