import { action } from 'mobx';
import browser from 'webextension-polyfill';

class RequestsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @action
    getCurrentFilteringState = () => adguard.requests
        .getCurrentFilteringState(this.rootStore.settingsStore.isFilteringEnabled);

    @action
    getCurrentAppState = () => adguard.requests.getCurrentAppState();

    @action
    setFilteringStatus = () => adguard.requests.setFilteringStatus({
        url: this.rootStore.settingsStore.currentURL,
        isEnabled: this.rootStore.settingsStore.isFilteringEnabled,
        isHttpsEnabled: this.rootStore.settingsStore.isHttpsFilteringEnabled,
    });

    @action
    openOriginCert = () => adguard.requests.openOriginCert(
        this.rootStore.settingsStore.currentTabHostname
    );

    @action
    removeCustomRules = () => adguard.requests
        .removeCustomRules(this.rootStore.settingsStore.currentURL);

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
    enableBlockingMode = async () => {
        const currentTab = await adguard.tabs.getCurrent();
        const { url, id } = currentTab;
        console.log(`Opening Assistant UI for tab id=${id} url=${url}`);
        const backgroundPage = browser.extension.getBackgroundPage();
        console.log('backgroundPage', backgroundPage);
        const { adguardApi } = backgroundPage;
        // adguardApi.openAssistant(id);
        // window.close();
    }
}

export default RequestsStore;
