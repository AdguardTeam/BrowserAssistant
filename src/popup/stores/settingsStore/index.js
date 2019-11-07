import {
    action, observable, computed, runInAction,
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

    @observable isPageSecured = true;

    @observable isHttpsFilteringEnabled = false;

    @observable isFilteringEnabled = true;

    @observable isInstalled = true;

    @observable isRunning = true;

    @observable isProtectionEnabled = true;

    @observable originCertStatus = ORIGIN_CERT_STATUS.VALID;

    @computed get isExpired() {
        return (this.originCertStatus === ORIGIN_CERT_STATUS.INVALID);
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
                const { hostname, protocol } = getUrlProperties(result.url);
                this.currentTabHostname = hostname;

                switch (protocol) {
                    case 'https:':
                        this.isHttps = true;
                        this.setSecure(false);
                        break;
                    case 'http:':
                        this.isHttps = false;
                        this.setSecure(false);
                        break;
                    default:
                        this.isHttps = false;
                        this.setSecure(true);
                }
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
        this.originCertStatus = ORIGIN_CERT_STATUS[status.toUpperCase()];
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
    setHttpAndHttpsFilteringActive = (isFilteringEnabled, isHttpsFilteringEnabled) => {
        this.isFilteringEnabled = isFilteringEnabled;
        this.isHttpsFilteringEnabled = isHttpsFilteringEnabled;
    };

    @action
    setCurrentFilteringState = (parameters) => {
        const {
            isFilteringEnabled,
            isHttpsFilteringEnabled,
            originCertStatus,
            isPageFilteredByUserFilter,
        } = parameters;
        this.setHttpAndHttpsFilteringActive(isFilteringEnabled, isHttpsFilteringEnabled);
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
    toggleProtection = () => {
        if (this.isProtectionEnabled === true) {
            this.setProtection(false);
        } else {
            this.setProtection(true);
        }
        this.rootStore.requestsStore.setProtectionStatus();
    }
}

export default SettingsStore;
