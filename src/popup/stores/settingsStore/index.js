import {
    action, computed, observable,
} from 'mobx';
import { ORIGINAL_CERT_STATUS, PROTOCOLS } from '../consts';
import log from '../../../lib/logger';
import { DOWNLOAD_LINK } from '../../../lib/consts';
import { CHROME_UPDATE_CRX, FIREFOX_UPDATE_XPI } from '../../../../tasks/consts';
import innerMessaging from '../../../lib/innerMessaging';

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

    @observable isSetupCorrect = true;

    @observable isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;

    @computed get pageProtocol() {
        return ({
            isHttp: this.currentProtocol === PROTOCOLS.HTTP,
            isHttps: this.currentProtocol === PROTOCOLS.HTTPS,
            isSecured: this.currentProtocol === PROTOCOLS.SECURED,
        });
    }

    setUpdateStatusInfo = (statusInfo) => {
        const {
            isAppUpToDate, isExtensionUpdated, isSetupCorrect, locale,
        } = statusInfo;

        this.setIsAppUpToDate(isAppUpToDate);
        this.setIsExtensionUpdated(isExtensionUpdated);
        this.setIsSetupCorrect(isSetupCorrect);
        this.rootStore.translationStore.setLocale(locale);
    };

    @action
    setIsAppUpToDate = (isAppUpToDate) => {
        this.isAppUpToDate = isAppUpToDate;
    };

    @action
    setIsExtensionUpdated = (isExtensionUpdated) => {
        this.isExtensionUpdated = isExtensionUpdated;
    };

    @action
    setIsSetupCorrect = (isSetupCorrect) => {
        this.isSetupCorrect = isSetupCorrect;
    };

    @action
    setReferrer = (referrer = '') => {
        this.referrer = referrer;
    };

    updateCurrentTabInfo = async () => {
        try {
            const urlProps = await innerMessaging.getCurrentTabUrlProperties();
            const referrer = await innerMessaging.getReferrer();
            this.setCurrentTabUrlProperties(urlProps);
            this.setReferrer(referrer);
            await this.rootStore.requestsStore.getCurrentFilteringState();
        } catch (error) {
            log.error(error);
        }
    };

    refreshUpdateStatusInfo = async () => {
        const res = await innerMessaging.getUpdateStatusInfo();
        this.setUpdateStatusInfo(res);
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
        innerMessaging.openPage(DOWNLOAD_LINK);
    };

    @action
    setHttpsFiltering = async (isHttpsFilteringEnabled) => {
        this.isHttpsFilteringEnabled = isHttpsFilteringEnabled;
        await this.rootStore.requestsStore.setFilteringStatus();
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
        const updateLink = this.isFirefox ? FIREFOX_UPDATE_XPI : CHROME_UPDATE_CRX;
        innerMessaging.openPage(updateLink);
    };
}

export default SettingsStore;
