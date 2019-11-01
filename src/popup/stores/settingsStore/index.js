import {
    action,
    observable,
    computed,
    runInAction,
} from 'mobx';

import { ORIGIN_CERT_STATUS } from '../consts';
import { getUrlProperties } from '../../../lib/helpers';

class SettingsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable currentTabHostname;

    @observable currentURL;

    @observable currentProtocol;

    @observable referrer;

    @observable originCertStatus = ORIGIN_CERT_STATUS.invalid;

    @observable isPageSecured = true;

    @observable isHttpsFilteringEnabled = false;

    @observable isExpired = false;

    @observable isFilteringEnabled = true;

    @observable isInstalled = true;

    @observable isRunning = true;

    @observable isProtectionEnabled = true;

    @computed get filteringStatus() {
        return (this.isHttpsFilteringEnabled || this.isPageSecured) || !this.isFilteringEnabled ? 'HTTPS' : 'HTTP';
    }

    @action
    getReferrer = async () => {
        const referrer = await adguard.tabs.getReferrer();
        runInAction(() => {
            this.referrer = referrer;
        });
    };

    @action
    getCurrentTabHostname = async () => {
        try {
            const result = await adguard.tabs.getCurrent();
            runInAction(() => {
                this.currentURL = result.url;
                this.currentTabHostname = getUrlProperties(result.url).hostname;
                this.currentProtocol = getUrlProperties(result.url).protocol;
            });
        } catch (error) {
            console.error(error.message);
        }
    };

    @action
    setOriginCertStatus = (status) => {
        this.originCertStatus = ORIGIN_CERT_STATUS[status];
    }

    @action
    setSecure = (isPageSecured) => {
        this.isPageSecured = isPageSecured;
    };

    @action
    setHttpsFiltering = (isHttpsFilteringEnabled) => {
        this.isHttpsFilteringEnabled = isHttpsFilteringEnabled;
        adguard.requests.setFilteringStatus({
            isEnabled: this.isFilteringEnabled,
            isHttpsEnabled: this.isFilteringEnabled,
            url: this.currentURL,
        });
    };

    @action
    setFiltering = (isFilteringEnabled) => {
        this.isFilteringEnabled = isFilteringEnabled;
        adguard.requests.setFilteringStatus({
            isEnabled: this.isFilteringEnabled,
            isHttpsEnabled: this.isFilteringEnabled,
            url: this.currentURL,
        });
    };

    @action
    setExpire = (isExpired) => {
        this.isExpired = isExpired;
    };

    @action
    setInstalled = (isInstalled) => {
        this.isInstalled = isInstalled;
    };

    @action
    setRunning = (isRunning) => {
        this.isRunning = isRunning;
    };

    @action
    setProtection = (isProtectionEnabled) => {
        this.isProtectionEnabled = isProtectionEnabled;
    };

    @action
    toggleProtection = () => {
        if (this.isProtectionEnabled === true) {
            this.isProtectionEnabled = false;
            this.isFilteringEnabled = false;
            this.isHttpsFilteringEnabled = false;
        } else {
            this.isProtectionEnabled = true;
            this.isFilteringEnabled = true;
            this.isHttpsFilteringEnabled = false;
        }
    }
}

export default SettingsStore;
