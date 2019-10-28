import { action } from 'mobx';

class RequestsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @action
    getCurrentFilteringState = () => adguard.requests.getCurrentFilteringState(
        this.rootStore.settingsStore.currentURL
    );

    @action
    getCurrentAppState = () => adguard.requests.getCurrentAppState();

    @action
    setFilteringStatus = () => adguard.requests.setFilteringStatus({
        url: this.rootStore.settingsStore.currentURL,
        isEnabled: this.rootStore.settingsStore.isFilteringEnabled,
        isHttpsEnabled: this.rootStore.settingsStore.isHttpsFilteringEnabled,
    })

    @action
    openOriginCert = () => adguard.requests.openOriginCert(
        this.rootStore.settingsStore.currentTabHostname
    );

    // TODO: how to define referrer?

    @action
    removeCustomRules = () => adguard.requests
        .removeCustomRules(this.rootStore.settingsStore.currentURL);

    @action
    reportSite = () => adguard.requests.reportSite({
        url: this.rootStore.settingsStore.currentURL,
        referrer: 'https://yandex.ru',
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
}

export default RequestsStore;
