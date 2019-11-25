import { action } from 'mobx';
import log from '../../../lib/logger';

class RequestsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    handleError = async (fn) => {
        try {
            await fn();
        } catch (e) {
            log.error(e);
        }
    };

    @action
    getCurrentFilteringState = async () => {
        return this.handleError(() => adguard.requests.getCurrentFilteringState(
            this.rootStore.settingsStore.currentURL
        ));
    };

    @action
    getCurrentAppState = async () => {
        return this.handleError(() => adguard.requests.getCurrentAppState());
    };

    @action
    setFilteringStatus = async () => {
        const {
            currentURL, isFilteringEnabled,
            isHttpsFilteringEnabled,
        } = this.rootStore.settingsStore;

        return this.handleError(() => adguard.requests.setFilteringStatus({
            url: currentURL,
            isEnabled: isFilteringEnabled,
            isHttpsEnabled: isHttpsFilteringEnabled,
        }));
    };

    @action
    openOriginCert = async () => {
        return this.handleError(() => adguard.requests.openOriginCert(
            this.rootStore.settingsStore.currentTabHostname
        ));
    };

    @action
    removeCustomRules = async () => {
        this.handleError(() => adguard.requests.removeCustomRules(
            this.rootStore.settingsStore.currentURL
        ));
        this.rootStore.uiStore.isPageFilteredByUserFilter = false;
        return this.rootStore.uiStore.isPageFilteredByUserFilter;
    };

    @action
    reportSite = async () => {
        return this.handleError(() => adguard.requests.reportSite({
            url: this.rootStore.settingsStore.currentURL,
            referrer: this.rootStore.settingsStore.referrer,
        }));
    };

    @action
    openFilteringLog = async () => {
        return this.handleError(() => adguard.requests.openFilteringLog());
    };

    @action
    removeRule = async () => {
        return this.handleError(() => adguard.requests.removeRule(
            this.rootStore.settingsStore.currentTabHostname
        ));
    };

    @action
    addRule = async () => {
        return this.handleError(() => adguard.requests.addRule(
            this.rootStore.settingsStore.currentTabHostname
        ));
    };

    @action
    setProtectionStatus = async () => {
        return this.handleError(() => adguard.requests.setProtectionStatus(
            this.rootStore.settingsStore.isProtectionEnabled
        ));
    };

    @action
    startApp = async () => {
        return this.handleError(() => adguard.requests.startApp());
    };

    @action
    openSettings = async () => {
        return this.handleError(() => adguard.requests.openSettings());
    };

    @action
    startBlockingAd = async () => {
        await adguard.tabs.initAssistant();
        window.close();
    };
}

export default RequestsStore;
