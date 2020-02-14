import {
    action, computed, observable, runInAction,
} from 'mobx';
import { ORIGINAL_CERT_STATUS, PROTOCOLS } from '../consts';
import log from '../../../lib/logger';

class SettingsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable currentTabHostname = '';

    @observable currentURL = '';

    @observable currentPort = 0;

    @observable currentProtocol = PROTOCOLS.HTTPS;

    @observable referrer = '';

    @observable originalCertIssuer = '';

    @observable isHttpsFilteringEnabled = false;

    @observable isFilteringEnabled = false;

    @observable isInstalled = true;

    @observable isRunning = true;

    @observable isProtectionEnabled = true;

    @observable originalCertStatus = ORIGINAL_CERT_STATUS.VALID;

    @observable isAppUpToDate = adguard.isAppUpToDate;

    @observable isExtensionUpdated = adguard.isExtensionUpdated;

    @observable isSetupCorrectly = adguard.isSetupCorrectly;

    @computed get pageProtocol() {
        return ({
            isHttp: this.currentProtocol === PROTOCOLS.HTTP,
            isHttps: this.currentProtocol === PROTOCOLS.HTTPS,
            isSecured: this.currentProtocol === PROTOCOLS.SECURED,
        });
    }

    @action
    getReferrer = async () => {
        const referrer = await adguard.tabs.getReferrer();

        runInAction(() => {
            this.referrer = referrer || '';
        });
    };

    @action
    getCurrentTabHostname = async () => {
        try {
            const {
                currentURL,
                currentPort,
                currentProtocol,
                hostname,
            } = await adguard.tabs.getCurrentTabUrlProperties();

            runInAction(() => {
                this.currentURL = currentURL;
                this.currentTabHostname = hostname || this.currentURL;
                this.currentPort = currentPort;
                this.currentProtocol = currentProtocol;
            });
        } catch (error) {
            log.error(error);
        }
    };

    @action
    openDownloadPage = () => {
        adguard.tabs.openDownloadPage();
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
        this.rootStore.uiStore.setPageFilteredByUserFilter(true);
        adguard.tabs.updateIconColor(isFilteringEnabled);
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
        adguard.tabs.updateIconColor(isFilteringEnabled);
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
    setCurrentAppState = (appState) => {
        const { isInstalled, isRunning, isProtectionEnabled } = appState;
        this.setInstalled(isInstalled);
        this.setRunning(isRunning);
        this.setProtection(isProtectionEnabled);
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
