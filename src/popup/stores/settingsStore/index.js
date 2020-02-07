import {
    action, computed, observable, runInAction,
} from 'mobx';
import { ORIGINAL_CERT_STATUS, PROTOCOLS, protocolToPortMap } from '../consts';
import { getUrlProperties } from '../../../lib/helpers';
import log from '../../../lib/logger';

class SettingsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable currentTabHostname = '';

    @observable currentURL = '';

    @observable currentPort = 0;

    @observable protocol = PROTOCOLS.HTTPS;

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

    @observable isSetupCorrectly = true;

    @computed get pageProtocol() {
        return ({
            isHttp: this.protocol === PROTOCOLS.HTTP,
            isHttps: this.protocol === PROTOCOLS.HTTPS,
            isSecured: this.protocol === PROTOCOLS.SECURED,
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
            const { url } = await adguard.tabs.getCurrent();
            runInAction(() => {
                this.currentURL = url;
                const { hostname, port, protocol } = getUrlProperties(url);

                this.currentTabHostname = hostname || this.currentURL;

                const formattedProtocol = protocol.slice(0, -1).toUpperCase();
                this.protocol = PROTOCOLS[formattedProtocol] || PROTOCOLS.SECURED;

                const defaultPort = protocolToPortMap[this.protocol];
                this.currentPort = port === '' ? defaultPort : Number(port);
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
    setCurrentAppState = (appState) => {
        const { isInstalled, isRunning, isProtectionEnabled } = appState;
        this.setInstalled(isInstalled);
        this.setRunning(isRunning);
        this.setProtection(isProtectionEnabled);
    };

    @action
    setSetupCorrectly = (isSetupCorrectly) => {
        this.isSetupCorrectly = isSetupCorrectly;
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
