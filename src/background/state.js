import isEqual from 'lodash/isEqual';
import throttle from 'lodash/throttle';
import browser from 'webextension-polyfill';
import { Api } from './api';
import versions from './versions';
import { FEEDBACK_ACTIONS } from '../lib/types';
import notifier from '../lib/notifier';
import {
    getFormattedProtocol, getUrlProps, isHttp,
} from '../lib/helpers';
import { PROTOCOLS } from '../popup/stores/consts';
import log from '../lib/logger';
import { longLivedMessageService } from './longLivedMessageService';

/**
 * This class handles app state
 * All requests to the native host should be made through this class
 */
class State {
    appState = {
        /**
         * Required flag, that determines whether the AdGuard app is installed on the computer
         * @type {boolean}
         */
        isInstalled: false,
        /**
         * Required flag, that determines whether the AdGuard app is running
         * @type {boolean}
         */
        isRunning: false,
        /**
         * Required flag, that determines whether the protection is enabled
         * @type {boolean}
         */
        isProtectionEnabled: false,
        /**
         * Required flag determining whether the license has expired
         * @type {boolean}
         */
        isLicenseExpired: false,
        /**
         * Optional parameter from the app
         * @type {string|null}
         */
        locale: null,
        /**
         * Optional parameter from the app, consider true unless is set to the false
         * @type {boolean}
         */
        isAuthorized: true,

        /**
         *  String that determines what action application wants browser assistant to do
         *  @type {typeof FEEDBACK_ACTIONS}
         */
        feedbackAction: FEEDBACK_ACTIONS.UPDATE_APPLICATION_APP_ONLY,
    };

    updateStatusInfo = {
        /**
         * Parameter that determines if the extension API version is up-to-date with the app API version
         * @type {boolean}
         */
        isAppUpToDate: true,
        /**
         * Flag that determines whether the extension's API, specified by request's parameters,
         * is successfully validated on the host's side
         * @type {boolean}
         */
        isValidatedOnHost: true,
    };

    hostInfo = {
        platform: '',
        version: '',
    };

    urlInfo = {
        isHttpsFilteringEnabled: false,
        isFilteringEnabled: false,
        isSecured: false,
        canChangeFilteringStatus: true,
    };

    set isHttpsFilteringEnabled(isHttpsFilteringEnabled) {
        this.urlInfo.isHttpsFilteringEnabled = isHttpsFilteringEnabled;
    }

    set isFilteringEnabled(isFilteringEnabled) {
        this.urlInfo.isFilteringEnabled = isFilteringEnabled;
    }

    set isSecured(isSecured) {
        this.urlInfo.isSecured = isSecured;
    }

    set canChangeFilteringStatus(canChangeFilteringStatus) {
        this.urlInfo.canChangeFilteringStatus = canChangeFilteringStatus;
    }

    updateSecured = (currentUrl) => {
        const { protocol } = getUrlProps(currentUrl);

        this.isSecured = getFormattedProtocol(protocol) === PROTOCOLS.SECURED;
    };

    /**
     * Handles init message response and updates app setup
     * @param response
     */
    initMessageHandler = (response) => {
        const { parameters, appState } = response;
        const {
            isValidatedOnHost, apiVersion, version, platform,
        } = parameters;
        const isAppUpToDate = versions.apiVersion <= apiVersion;
        this.setAppState(appState);
        this.setUpdateStatusInfo(isAppUpToDate, isValidatedOnHost);
        this.setHostInfo(platform, version);
    };

    /**
     * Listens messages sent by native host without request
     */
    nativeHostMessagesHandler = async (message) => {
        if (!message || !message.appState) {
            return;
        }

        this.setAppState(message.appState);
    };

    init = () => {
        this.api = new Api(this.nativeHostMessagesHandler, this.initMessageHandler);
    };

    /**
     * Returns current app state
     */
    getAppState = () => {
        let { locale } = this.appState;
        // if no locale use browser locale
        if (!locale) {
            locale = browser.i18n.getUILanguage();
        }

        return {
            ...this.appState,
            locale,
        };
    };

    /**
     * Returns update status info
     */
    getUpdateStatusInfo() {
        return this.updateStatusInfo;
    }

    /**
     * Validates app state, sets app state and notifies external modules that state has changed
     * @param {*} appState
     */
    setAppState = (appState = {}) => {
        const {
            isInstalled,
            isRunning,
            isProtectionEnabled,
            isLicenseExpired,
            locale,
            isAuthorized,
        } = appState;

        let { feedbackAction = FEEDBACK_ACTIONS.UPDATE_APPLICATION_APP_ONLY } = appState;

        if ([isInstalled, isRunning, isProtectionEnabled].some((state) => state === undefined)) {
            // eslint-disable-next-line max-len
            const message = `isInstalled=${isInstalled}, isRunning=${isRunning}, isProtectionEnabled=${isProtectionEnabled}`;
            throw new Error(`All states should be defined: received ${message}`);
        }

        /**
         * Validate feedbackAction values, set to default if not found among known actions
         */
        if (!Object.values(FEEDBACK_ACTIONS).includes(feedbackAction)) {
            log.debug(`Extension doesn't know about this feedback action: ${feedbackAction}`);
            feedbackAction = FEEDBACK_ACTIONS.UPDATE_APPLICATION_APP_ONLY;
        }

        const nextAppState = {
            ...this.appState,
            isInstalled,
            isRunning,
            isProtectionEnabled,
            isLicenseExpired,
            feedbackAction,
        };

        if (locale !== undefined) {
            nextAppState.locale = locale;
        }

        if (isAuthorized !== undefined) {
            nextAppState.isAuthorized = isAuthorized;
        }

        const appStateChanged = !isEqual(this.appState, nextAppState);

        if (appStateChanged) {
            this.appState = { ...this.appState, ...nextAppState };
        }

        // Notify modules only when appState changes or feedbackAction asks
        // to update filtering state
        if (appStateChanged || feedbackAction === FEEDBACK_ACTIONS.UPDATE_FILTERING_STATUS) {
            this.notifyModules();
        }
    };

    NOTIFY_TIMEOUT_MS = 40;

    /**
     * Notifies modules about state changes
     * Throttle function, so we can call it whenever we want
     */
    notifyModules = throttle(async (tab) => {
        // Notify browser action tab about changed state
        notifier.notifyListeners(notifier.types.STATE_UPDATED, tab);

        // Notify popup about changed state
        longLivedMessageService.notifyPopupStateUpdated(
            this.getAppState(),
            this.getUpdateStatusInfo(),
        );
    }, this.NOTIFY_TIMEOUT_MS, { leading: false });

    /**
     * Sets update status info and notifies external modules when it changes
     * @param isAppUpToDate
     * @param isValidatedOnHost
     */
    setUpdateStatusInfo = (isAppUpToDate, isValidatedOnHost) => {
        const nextUpdateStatusInfo = {
            isAppUpToDate,
            isValidatedOnHost,
        };

        // Notify modules only when updateStatusInfo changes
        if (!isEqual(this.updateStatusInfo, nextUpdateStatusInfo)) {
            this.updateStatusInfo = { ...this.updateStatusInfo, ...nextUpdateStatusInfo };
            this.notifyModules();
        }
    };

    /**
     * Sets host info
     * @param platform
     * @param version
     */
    setHostInfo = (platform, version) => {
        this.hostInfo = {
            platform,
            version,
        };
    };

    /**
     * Checks if app is working
     * @returns {boolean}
     */
    isAppWorking() {
        return [
            this.appState.isInstalled,
            this.appState.isRunning,
            this.appState.isProtectionEnabled,
            this.updateStatusInfo.isAppUpToDate,
            this.updateStatusInfo.isValidatedOnHost,
        ].every((state) => state === true);
    }

    /**
     * Returns app locale key
     * @returns {string}
     */
    getLocale() {
        return this.appState.locale || browser.i18n.getUILanguage();
    }

    /**
     * Returns current filtering state or null if url is not http
     * @param {{id: number, url: string}} tab
     * @param {boolean} forceStart
     * @returns {Promise<null|*>}
     */
    getCurrentFilteringState = async (tab, forceStart = false) => {
        const url = tab?.url;
        this.updateSecured(url);

        // Do not send empty urls or non http urls, see - AG-2360
        if (!forceStart && !(url && isHttp(url))) {
            return null;
        }

        const { port } = getUrlProps(url);

        const response = await this.api.getCurrentFilteringState(url, port, forceStart);

        const { appState, parameters } = response;
        if (!parameters) {
            return null;
        }
        const {
            isFilteringEnabled,
            isHttpsFilteringEnabled,
        } = parameters;

        let { canChangeFilteringStatus } = parameters;

        this.setAppState(appState);
        this.isFilteringEnabled = isFilteringEnabled;
        this.isHttpsFilteringEnabled = isHttpsFilteringEnabled;
        if (canChangeFilteringStatus === undefined) {
            canChangeFilteringStatus = true; // by default consider that this flag is true
        }
        this.canChangeFilteringStatus = canChangeFilteringStatus;
        return { ...parameters, canChangeFilteringStatus };
    };

    setProtectionStatus = async (isEnabled) => {
        const response = await this.api.setProtectionStatus(isEnabled);
        this.setAppState(response.appState);
        return response.appState;
    };

    getCurrentAppState = async () => {
        const appState = await this.api.getCurrentAppState();
        this.setAppState(appState);
        return appState;
    };

    setFilteringStatus = async (isEnabled, isHttpsEnabled, url) => {
        this.isEnabled = isEnabled;
        this.isHttpsFilteringEnabled = isHttpsEnabled;

        const response = await this.api.setFilteringStatus(
            isEnabled,
            isHttpsEnabled,
            url,
        );
        this.setAppState(response.appState);
    };

    removeCustomRules = async (url) => {
        const response = await this.api.removeCustomRules(url);
        this.setAppState(response.appState);
    };

    openOriginalCert = async (domain, port) => {
        const response = await this.api.openOriginalCert(domain, port);
        this.setAppState(response.appState);
    };

    reportSite = async (url, referrer) => {
        const response = await this.api.reportSite(url, referrer);
        this.setAppState(response.appState);
        return response.parameters.reportUrl;
    };

    openFilteringLog = async () => {
        const response = await this.api.openFilteringLog();
        this.setAppState(response.appState);
    };

    openSettings = async () => {
        const response = await this.api.openSettings();
        this.setAppState(response.appState);
    };

    updateApp = async () => {
        const response = await this.api.updateApp();
        this.setAppState(response.appState);
    };

    addRule = async (ruleText) => {
        const response = await this.api.addRule(ruleText);
        this.setAppState(response.appState);
    };

    pauseFiltering = async (url, timeout) => {
        const response = await this.api.pauseFiltering(url, timeout);
        this.setAppState(response.appState);
    };
}

export default new State();
