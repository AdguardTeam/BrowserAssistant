import {
    action,
    observable,
    runInAction,
} from 'mobx';

import { ORIGIN_CERT_STATUS } from '../consts';
import { getUrlProperties } from '../../../lib/helpers';

class SettingsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable currentTabHostname = '';

    @observable currentURL = '';

    @observable isHttps = false;

    @observable referrer = '';

    @observable originCertStatus = ORIGIN_CERT_STATUS.invalid;

    @observable isPageSecured = true;

    @observable isHttpsFilteringEnabled = false;

    @observable isExpired = this.originCertStatus === ORIGIN_CERT_STATUS.invalid;

    @observable isFilteringEnabled = true;

    @observable isInstalled = true;

    @observable isRunning = true;

    @observable isProtectionEnabled = true;

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
                const { hostname, protocol } = getUrlProperties(result.url);
                this.currentTabHostname = hostname;
                this.isHttps = protocol === 'https:';
            });
        } catch (error) {
            console.error(error.message);
        }
    };

    @action
    setSecure = (isPageSecured) => {
        this.isPageSecured = isPageSecured;
    };

    @action
    setHttpsFiltering = (isHttpsFilteringEnabled) => {
        this.isHttpsFilteringEnabled = isHttpsFilteringEnabled;
        this.rootStore.requestsStore.setFilteringStatus();
    };

    @action
    setFiltering = (isFilteringEnabled) => {
        this.isFilteringEnabled = isFilteringEnabled;
        this.rootStore.requestsStore.setFilteringStatus();
    };

    @action
    setOriginCertStatus = (status) => {
        this.originCertStatus = ORIGIN_CERT_STATUS[status];
    };

    @action
    setCurrentFilteringState = (parameters) => {
        const {
            isFilteringEnabled,
            isHttpsFilteringEnabled,
            isPageSecured,
            originCertStatus,
            isPageFilteredByUserFilter,
        } = parameters;
        this.setSecure(isPageSecured);
        this.setHttpsFiltering(isHttpsFilteringEnabled);
        this.setFiltering(isFilteringEnabled);
        this.setOriginCertStatus(originCertStatus);
        this.rootStore.uiStore.setPageChanged(isPageFilteredByUserFilter);
    };

    @action
    setCurrentAppState = (workingState) => {
        const { isInstalled, isRunning, isProtectionEnabled } = workingState;
        this.setInstalled(isInstalled);
        this.setRunning(isRunning);
        this.setProtection(isProtectionEnabled);
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
