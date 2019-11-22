import { action } from 'mobx';
import log from '../../../lib/logger';

class RequestsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    handleError = (fn) => {
        fn().catch((err) => {
            log.warn(err.message);
            this.rootStore.uiStore.setPending(true);
            this.rootStore.uiStore.updateUi();
        });
    };

    @action
    getCurrentFilteringState = () => {
        this.handleError(() => adguard.requests
            .getCurrentFilteringState(this.rootStore.settingsStore.currentURL));
    };

    @action
    getCurrentAppState = () => {
        this.handleError(() => adguard.requests.getCurrentAppState());
    };

    @action
    setFilteringStatus = () => {
        const {
            currentURL, isFilteringEnabled,
            isHttpsFilteringEnabled,
        } = this.rootStore.settingsStore;

        this.handleError(() => adguard.requests.setFilteringStatus({
            url: currentURL,
            isEnabled: isFilteringEnabled,
            isHttpsEnabled: isHttpsFilteringEnabled,
        }));
    };

    @action
    openOriginCert = () => {
        this.handleError(() => adguard.requests.openOriginCert(
            this.rootStore.settingsStore.currentTabHostname
        ));
    };

    @action
    removeCustomRules = () => {
        this.handleError(() => adguard.requests.removeCustomRules(
            this.rootStore.settingsStore.currentURL
        ));
        this.rootStore.uiStore.isPageFilteredByUserFilter = false;
    };

    @action
    reportSite = () => {
        this.handleError(() => adguard.requests.reportSite({
            url: this.rootStore.settingsStore.currentURL,
            referrer: this.rootStore.settingsStore.referrer,
        }));
    };

    @action
    openFilteringLog = () => {
        this.handleError(() => adguard.requests.openFilteringLog());
    };

    @action
    removeRule = () => {
        this.handleError(() => adguard.requests.removeRule(
            this.rootStore.settingsStore.currentTabHostname
        ));
    };

    @action
    addRule = () => {
        this.handleError(() => adguard.requests.addRule(
            this.rootStore.settingsStore.currentTabHostname
        ));
    };

    @action
    setProtectionStatus = () => {
        this.handleError(() => adguard.requests.setProtectionStatus(
            this.rootStore.settingsStore.isProtectionEnabled
        ));
    };

    @action
    startApp = () => {
        this.handleError(() => adguard.requests.startApp());
    };

    @action
    openSettings = () => {
        this.handleError(() => adguard.requests.openSettings());
    };

    @action
    startBlockingAd = async () => {
        await adguard.tabs.initAssistant();
        window.close();
    };
}

export default RequestsStore;
