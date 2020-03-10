import {
    action, computed, observable,
} from 'mobx';
import { ORIGINAL_CERT_STATUS, PROTOCOLS } from '../consts';
import log from '../../../lib/logger';
import { DOWNLOAD_LINK } from '../../../lib/conts';
import { CHROME_UPDATE_CRX, FIREFOX_UPDATE_XPI } from '../../../../tasks/consts';

class SettingsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable currentTabHostname = '';

    @observable currentURL = '';

    @observable currentPort = 0;

    @observable currentProtocol = PROTOCOLS.SECURED;

    @observable referrer = '';

    @observable originalCertIssuer = '';

    @observable isHttpsFilteringEnabled = false;

    @observable isFilteringEnabled = false;

    @observable isInstalled = true;

    @observable isRunning = true;

    @observable isProtectionEnabled = true;

    @observable originalCertStatus = ORIGINAL_CERT_STATUS.VALID;

    @observable isAppUpToDate = true;

    @observable isExtensionUpdated = true;

    @observable isSetupCorrectly = true;

    @observable isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;

    @computed get pageProtocol() {
        return ({
            isHttp: this.currentProtocol === PROTOCOLS.HTTP,
            isHttps: this.currentProtocol === PROTOCOLS.HTTPS,
            isSecured: this.currentProtocol === PROTOCOLS.SECURED,
        });
    }

    @action
    setIsAppUpToDate = (isAppUpToDate) => {
        this.isAppUpToDate = isAppUpToDate;
    };

    @action
    setIsExtensionUpdated = (isExtensionUpdated) => {
        this.isExtensionUpdated = isExtensionUpdated;
    };

    @action
    setIsSetupCorrectly = (isSetupCorrectly) => {
        this.isSetupCorrectly = isSetupCorrectly;
    };

    @action
    getReferrer = async () => {
        await adguard.tabs.getReferrer();
    };

    @action
    setReferrer = (referrer) => {
        this.referrer = referrer || '';
    };

    @action
    getCurrentTabUrlProperties = async () => {
        try {
            await adguard.tabs.getCurrentTabUrlProperties();
        } catch (error) {
            log.error(error);
        }
    };

    @action
    setCurrentTabUrlProperties = (urlProps) => {
        const {
            currentURL,
            currentPort,
            currentProtocol,
            hostname,
        } = urlProps;

        this.currentURL = currentURL;
        this.currentTabHostname = hostname || this.currentURL;
        this.currentPort = currentPort;
        this.currentProtocol = currentProtocol;
    };

    @action
    openDownloadPage = () => {
        adguard.tabs.openPage(DOWNLOAD_LINK);
    };

    @action
    setHttpsFiltering = (isHttpsFilteringEnabled) => {
        this.isHttpsFilteringEnabled = isHttpsFilteringEnabled;
        this.rootStore.requestsStore.setFilteringStatus();
        this.rootStore.uiStore.reloadPageAfterSwitcherTransition();
    };

    @action
    setFiltering = async (isFilteringEnabled) => {
        this.isFilteringEnabled = isFilteringEnabled;
        await this.rootStore.requestsStore.setFilteringStatus();
        this.rootStore.uiStore.reloadPageAfterSwitcherTransition();
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
    setProtection = async (isProtectionEnabled) => {
        this.isProtectionEnabled = isProtectionEnabled;
    };

    @action
    setHttpAndHttpsFilteringActive = async (isFilteringEnabled, isHttpsFilteringEnabled) => {
        this.isFilteringEnabled = isFilteringEnabled;
        this.isHttpsFilteringEnabled = isHttpsFilteringEnabled;
        await adguard.tabs.updateIconColor(isFilteringEnabled);
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
        const {
            isInstalled, isRunning, isProtectionEnabled, locale,
        } = appState;
        this.setInstalled(isInstalled);
        this.setRunning(isRunning);
        this.setProtection(isProtectionEnabled);
        this.rootStore.translationStore.setLocale(locale);
    };

    @action
    updateExtension = () => {
        const { isFirefox } = this;
        const updateLink = isFirefox ? FIREFOX_UPDATE_XPI : CHROME_UPDATE_CRX;
        adguard.tabs.openPage(updateLink);
    };
}

export default SettingsStore;
