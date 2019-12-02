import {
    action, observable, computed, runInAction,
} from 'mobx';
import { ORIGINAL_CERT_STATUS } from '../consts';
import { getUrlProperties } from '../../../lib/helpers';
import log from '../../../lib/logger';

class SettingsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable currentTabHostname = '';

    @observable currentURL = '';

    @observable isHttps = true;

    @observable referrer = '';

    @observable originalCertIssuer = '';

    @observable isPageSecured = false;

    @observable isHttpsFilteringEnabled = false;

    @observable isFilteringEnabled = false;

    @observable isInstalled = true;

    @observable isRunning = true;

    @observable isProtectionEnabled = true;

    @observable originalCertStatus = ORIGINAL_CERT_STATUS.VALID;

    @observable isAppUpToDate = adguard.isAppUpToDate;

    @observable isExtensionUpdated = adguard.isExtensionUpdated;

    @computed get isExpired() {
        return (this.originalCertStatus === ORIGINAL_CERT_STATUS.INVALID);
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
                this.currentTabHostname = hostname || this.currentURL;

                switch (protocol) {
                    case 'https:':
                        this.setIsHttps(true);
                        this.setSecure(false);
                        break;
                    case 'http:':
                        this.setIsHttps(false);
                        this.setSecure(false);
                        break;
                    default:
                        this.setIsHttps(false);
                        this.setSecure(true);
                }
            });
        } catch (error) {
            log.error(error.message);
        }
    };

    @action
    openDownloadPage = () => {
        adguard.tabs.openDownloadPage();
    };

    @action
    setIsHttps = (isHttps) => {
        this.isHttps = isHttps;
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
    setOriginalCertStatus = (status) => {
        this.originalCertStatus = ORIGINAL_CERT_STATUS[status.toUpperCase()];
    };

    @action
    setOriginalCertIssuer = (originalCertIssuer) => {
        this.originalCertIssuer = originalCertIssuer;
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
            originalCertStatus,
            isPageFilteredByUserFilter,
            originalCertIssuer,
        } = parameters;
        this.setHttpAndHttpsFilteringActive(isFilteringEnabled, isHttpsFilteringEnabled);
        this.setOriginalCertStatus(originalCertStatus);
        this.setOriginalCertIssuer(originalCertIssuer);
        this.rootStore.uiStore.setPageFilteredByUserFilter(isPageFilteredByUserFilter);
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
        if (this.isProtectionEnabled) {
            this.setProtection(false);
        } else {
            this.setProtection(true);
        }
        this.rootStore.requestsStore.setProtectionStatus();
    };

    @action
    updateApp = () => {
        // TODO: update app
        const updateSuccess = true;
        if (updateSuccess) {
            adguard.isAppUpToDate = true;
            this.isAppUpToDate = adguard.isAppUpToDate;
        }
    };

    @action
    updateExtension = () => {
        // TODO: update extension
        const updateSuccess = true;
        if (updateSuccess) {
            adguard.isExtensionUpdated = true;
            this.isExtensionUpdated = adguard.isExtensionUpdated;
        }
    };
}

export default SettingsStore;
