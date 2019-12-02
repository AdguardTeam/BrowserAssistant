import { action } from 'mobx';
import log from '../../../lib/logger';

class RequestsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @action
    getCurrentFilteringState = async () => {
        try {
            await adguard.requests
                .getCurrentFilteringState(this.rootStore.settingsStore.currentURL);
        } catch (e) {
            log.error(e);
        }
    };

    @action
    getCurrentAppState = async () => {
        try {
            await adguard.requests.getCurrentAppState();
        } catch (e) {
            log.error(e);
        }
    };

    @action
    setFilteringStatus = async () => {
        const {
            currentURL, isFilteringEnabled,
            isHttpsFilteringEnabled,
        } = this.rootStore.settingsStore;

        try {
            await adguard.requests.setFilteringStatus({
                url: currentURL,
                isEnabled: isFilteringEnabled,
                isHttpsEnabled: isHttpsFilteringEnabled,
            });
        } catch (e) {
            log.error(e);
        }
    };

    @action
    openOriginalCert = async () => {
        try {
            await adguard.requests
                .openOriginalCert(this.rootStore.settingsStore.currentTabHostname);
        } catch (e) {
            log.error(e);
        }
    };

    @action
    removeCustomRules = async () => {
        try {
            await adguard.requests.removeCustomRules(this.rootStore.settingsStore.currentURL);
            this.rootStore.uiStore.isPageFilteredByUserFilter = false;
        } catch (e) {
            log.error(e);
        }
    };

    @action
    reportSite = async () => {
        try {
            await adguard.requests.reportSite({
                url: this.rootStore.settingsStore.currentURL,
                referrer: this.rootStore.settingsStore.referrer,
            });
        } catch (e) {
            log.error(e);
        }
    };

    @action
    openFilteringLog = async () => {
        try {
            await adguard.requests.openFilteringLog();
        } catch (e) {
            log.error(e);
        }
    };

    @action
    removeRule = async () => {
        try {
            await adguard.requests.removeRule(
                this.rootStore.settingsStore.currentTabHostname
            );
        } catch (e) {
            log.error(e);
        }
    };

    @action
    addRule = async () => {
        try {
            await adguard.requests.addRule(
                this.rootStore.settingsStore.currentTabHostname
            );
        } catch (e) {
            log.error(e);
        }
    };

    @action
    setProtectionStatus = async () => {
        try {
            await adguard.requests.setProtectionStatus(
                this.rootStore.settingsStore.isProtectionEnabled
            );
        } catch (e) {
            log.error(e);
        }
    };

    @action
    startApp = async () => {
        try {
            await adguard.requests.startApp();
        } catch (e) {
            log.error(e);
        }
    };

    @action
    openSettings = async () => {
        try {
            await adguard.requests.openSettings();
        } catch (e) {
            log.error(e);
        }
    };

    @action
    startBlockingAd = async () => {
        try {
            await adguard.tabs.initAssistant();
        } catch (e) {
            log.error(e);
        }
        window.close();
    };
}

export default RequestsStore;
