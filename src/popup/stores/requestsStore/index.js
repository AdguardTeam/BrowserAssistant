import { action } from 'mobx';

class RequestsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @action
    getCurrentFilteringState = () => adguard.requests
        .getCurrentFilteringState(this.rootStore.settingsStore.currentURL);

    @action
    getCurrentAppState = () => adguard.requests.getCurrentAppState();

    @action
    setFilteringStatus = () => {
        const {
            currentURL, isFilteringEnabled,
            isHttpsFilteringEnabled,
        } = this.rootStore.settingsStore;

        adguard.requests.setFilteringStatus({
            url: currentURL,
            isEnabled: isFilteringEnabled,
            isHttpsEnabled: isHttpsFilteringEnabled,
        });
    }

    @action
    openOriginCert = () => adguard.requests.openOriginCert(
        this.rootStore.settingsStore.currentTabHostname
    );

    @action
    removeCustomRules = () => {
        adguard.requests
            .removeCustomRules(this.rootStore.settingsStore.currentURL);
        adguard.tabs.isPageChanged = false;
        this.rootStore.uiStore.setPageChanged(false);
    }

    @action
    reportSite = () => adguard.requests.reportSite({
        url: this.rootStore.settingsStore.currentURL,
        referrer: this.rootStore.settingsStore.referrer,
    });

    @action
    openFilteringLog = () => adguard.requests.openFilteringLog();

    @action
    removeRule = () => adguard.requests.removeRule(this.rootStore.settingsStore.currentTabHostname);

    @action
    addRule = () => adguard.requests.addRule(this.rootStore.settingsStore.currentTabHostname);

    @action
    setProtectionStatus = () => adguard.requests.setProtectionStatus(
        this.rootStore.settingsStore.isProtectionEnabled
    );

    @action
    openSettings = () => adguard.requests.openSettings();

    @action
    startBlockingAd = async () => {
        await adguard.tabs.initAssistant();
        window.close();
    };
}

export default RequestsStore;
