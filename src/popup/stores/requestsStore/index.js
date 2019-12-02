import { action } from 'mobx';
import log from '../../../lib/logger';

class RequestsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @action
    getCurrentFilteringState = async () => {
        try {
            adguard.requests.getCurrentFilteringState(this.rootStore.settingsStore.currentURL);
        } catch (e) {
            log.error(e);
        }
    };

    @action
    getCurrentAppState = async () => {
        try {
            adguard.requests.getCurrentAppState();
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
            adguard.requests.setFilteringStatus({
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
            adguard.requests.openOriginalCert(this.rootStore.settingsStore.currentTabHostname);
        } catch (e) {
            log.error(e);
        }
    };

    @action
    removeCustomRules = async () => {
        try {
            adguard.requests.removeCustomRules(this.rootStore.settingsStore.currentURL);
            this.rootStore.uiStore.isPageFilteredByUserFilter = false;
        } catch (e) {
            log.error(e);
        }
    };

    @action
    reportSite = async () => {
        try {
            adguard.requests.reportSite({
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
            adguard.requests.openFilteringLog();
        } catch (e) {
            log.error(e);
        }
    };

    @action
    removeRule = async () => {
        try {
            adguard.requests.removeRule(
                this.rootStore.settingsStore.currentTabHostname
            );
        } catch (e) {
            log.error(e);
        }
    };

    @action
    addRule = async () => {
        try {
            adguard.requests.addRule(
                this.rootStore.settingsStore.currentTabHostname
            );
        } catch (e) {
            log.error(e);
        }
    };

    @action
    setProtectionStatus = async () => {
        try {
            adguard.requests.setProtectionStatus(
                this.rootStore.settingsStore.isProtectionEnabled
            );
        } catch (e) {
            log.error(e);
        }
    };

    @action
    startApp = async () => {
        try {
            adguard.requests.startApp();
        } catch (e) {
            log.error(e);
        }
    };

    @action
    openSettings = async () => {
        try {
            adguard.requests.openSettings();
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
