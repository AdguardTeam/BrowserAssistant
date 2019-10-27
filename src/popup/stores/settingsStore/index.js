import {
    action,
    observable,
    computed,
    runInAction,
} from 'mobx';

import tabs from '../../../background/tabs';
import { getHostname } from '../../../lib/helpers';

class SettingsStore {
    @observable currentTabHostname;

    @observable currentURL;

    @observable isPageSecured = false;

    @observable isHttpsFilteringEnabled = false;

    @observable isExpired = false;

    @observable isFilteringEnabled = true;

    @observable isInstalled = true;

    @observable isRunning = true;

    @observable isProtectionEnabled = true;

    @computed get filteringStatus() { return this.isHttpsFilteringEnabled ? 'HTTPS' : 'HTTP'; }

    @action
    getCurrentTabHostname = async () => {
        try {
            const result = await tabs.getCurrent();
            runInAction(() => {
                this.currentURL = result;
                this.currentTabHostname = getHostname(result.url);
            });
        } catch (e) {
            console.log(e);
        }
    };

    @action
    setSecure = (isPageSecured) => {
        this.isPageSecured = isPageSecured;
    };

    @action
    setHttpsFiltering = (isHttpsFilteringEnabled) => {
        this.isHttpsFilteringEnabled = isHttpsFilteringEnabled;
    };

    @action
    setExpire = (isExpired) => {
        this.isExpired = isExpired;
    };

    @action
    setFiltering = (isFilteringEnabled) => {
        this.isFilteringEnabled = isFilteringEnabled;
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
