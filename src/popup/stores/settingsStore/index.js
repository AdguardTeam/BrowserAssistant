import {
    action,
    observable,
    computed,
    runInAction,
} from 'mobx';

import { ORIGIN_CERT_STATUS } from '../consts';
import { getHostname } from '../../../lib/helpers';

class SettingsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable currentTabHostname;

    @observable currentURL;

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
        return this.isHttpsFilteringEnabled ? 'HTTPS' : 'HTTP';
    }

    @action
    getReferrer = async () => {
        const referrer = await adguard.tabs.getReferrer();
        runInAction(() => {
            this.referrer = referrer;
        });
    };

    @action
    setReferrer = (referrer) => {
        this.referrer = referrer;
    };

    @action
    getCurrentTabHostname = async () => {
        try {
            const result = await adguard.tabs.getCurrent();
            runInAction(() => {
                this.currentURL = result;
                this.currentTabHostname = getHostname(result.url);
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
    };

    @action
    setFiltering = (isFilteringEnabled) => {
        this.isFilteringEnabled = isFilteringEnabled;
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
