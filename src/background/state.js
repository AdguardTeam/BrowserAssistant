import isEqual from 'lodash/isEqual';
import throttle from 'lodash/throttle';
import browserApi from '../lib/browserApi';
import api from './api';
import versions from './versions';
import { POPUP_MESSAGES } from '../lib/types';
import { BASE_LOCALE } from '../../tasks/langConstants';
import notifier from '../lib/notifier';
import { getUrlProps, isHttp } from '../lib/helpers';
import log from '../lib/logger';

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
         * Optional parameter from the app
         * @type {string}
         */
        locale: BASE_LOCALE,
        /**
         * Optional parameter from the app, consider true unless is set to the false
         * @type {boolean}
         */
        isAuthorized: true,
    };

    updateStatusInfo = {
        /**
         * Parameter that determines if extension api version is up to date with app api version
         * @type {boolean}
         */
        isAppUpToDate: false,
        /**
         * Flag, that determines whether the extensions api, specified by request's parameters
         * is successfully validated on the host's side
         * @type {boolean}
         */
        isValidatedOnHost: false,
    };

    init = () => {
        api.addMessageListener(this.nativeHostMessagesHandler);
        api.addInitMessageHandler(this.initMessageHandler);
    };

    /**
     * Handles init message response and updates app setup
     * @param response
     */
    initMessageHandler = (response) => {
        const { parameters, appState } = response;
        const isAppUpToDate = versions.apiVersion <= parameters.apiVersion;
        const { isValidatedOnHost } = parameters;
        this.setAppState(appState);
        this.setUpdateStatusInfo(isAppUpToDate, isValidatedOnHost);
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

    /**
     * Returns current app state
     */
    getAppState = () => {
        return this.appState;
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
    setAppState = (appState) => {
        const {
            isInstalled,
            isRunning,
            isProtectionEnabled,
            locale,
            isAuthorized,
        } = appState;

        if ([isInstalled, isRunning, isProtectionEnabled].some((state) => state === undefined)) {
            const message = `isInstalled=${isInstalled}, isRunning=${isRunning}, isProtectionEnabled=${isProtectionEnabled}`;
            throw new Error(`All states should be defined: received ${message}`);
        }
        const nextAppState = {
            ...this.appState,
            isInstalled,
            isRunning,
            isProtectionEnabled,
        };

        if (locale !== undefined) {
            nextAppState.locale = locale;
        }

        if (isAuthorized !== undefined) {
            nextAppState.isAuthorized = isAuthorized;
        }

        // Notify modules only when appState changes
        if (!isEqual(this.appState, nextAppState)) {
            this.appState = { ...this.appState, ...nextAppState };
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
        await browserApi.runtime.sendMessage({
            type: POPUP_MESSAGES.STATE_UPDATED,
            data: {
                appState: this.getAppState(),
                updateStatusInfo: this.getUpdateStatusInfo(),
            },
        });
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
        return this.appState.locale;
    }

    /**
     * Returns current filtering state or null if was unable to retrieve it
     * @param {{id: number, url: string}} tab
     * @param {boolean} forceStart
     * @returns {Promise<null|*>}
     */
    getCurrentFilteringState = async (tab, forceStart = false) => {
        const { url } = tab;
        const { port } = getUrlProps(url);
        if (!isHttp(url) || !port) {
            return null;
        }

        let response;
        try {
            response = await api.getCurrentFilteringState(url, port, forceStart);
        } catch (e) {
            log.debug(e);
            return null;
        }

        this.setAppState(response.appState);
        return response.parameters;
    };

    setProtectionStatus = async (isEnabled) => {
        const response = await api.setProtectionStatus(isEnabled);
        this.setAppState(response.appState);
        return response.appState;
    };

    getCurrentAppState = async () => {
        let appState;
        try {
            appState = await api.getCurrentAppState();
        } catch (e) {
            log.error(e);
        }
        this.setAppState(appState);
        return appState;
    };

    setFilteringStatus = async (isEnabled, isHttpsEnabled, url) => {
        const response = await api.setFilteringStatus(
            isEnabled,
            isHttpsEnabled,
            url
        );
        this.setAppState(response.appState);
    };

    removeCustomRules = async (url) => {
        const response = await api.removeCustomRules(url);
        this.setAppState(response.appState);
    };

    openOriginalCert = async (domain, port) => {
        const response = await api.openOriginalCert(domain, port);
        this.setAppState(response.appState);
    };

    reportSite = async (url, referrer) => {
        const response = await api.reportSite(url, referrer);
        this.setAppState(response.appState);
        return response.parameters.reportUrl;
    };

    openFilteringLog = async () => {
        const response = await api.openFilteringLog();
        this.setAppState(response.appState);
    };

    openSettings = async () => {
        const response = await api.openSettings();
        this.setAppState(response.appState);
    };

    updateApp = async () => {
        const response = await api.updateApp();
        this.setAppState(response.appState);
    };

    addRule = async (ruleText) => {
        const response = await api.addRule(ruleText);
        this.setAppState(response.appState);
    }
}

export default new State();
