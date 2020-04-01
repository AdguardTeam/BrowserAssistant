import browserApi from '../lib/browserApi';
import nativeHostApi from './NativeHostApi';
import versions from './versions';
import { MESSAGE_TYPES } from '../lib/types';
import { BASE_LOCALE } from '../../tasks/langConstants';
import notifier from '../lib/notifier';
import { getUrlProps } from '../lib/helpers';

class State {
    /**
     * Required flag, that determines whether the AdGuard app is installed on the computer
     * @type {boolean}
     */
    isInstalled = true;

    /**
     * Required flag, that determines whether the AdGuard app is running
     * @type {boolean}
     */
    isRunning = true;

    /**
     * Required flag, that determines whether the protection is enabled
     * @type {boolean}
     */
    isProtectionEnabled = true;

    /**
     * Optional parameter from the app
     * @type {string}
     */
    locale = BASE_LOCALE;

    /**
     * Optional parameter from the app, consider true unless is set to the false
     * @type {boolean}
     */
    isAuthorized = true;

    /**
     * Parameter that determines if extension api version is up to date with app api version
     * @type {boolean}
     */
    isAppUpToDate = true;

    /**
     * Flag, that determines whether the extensions api, specified by request's parameters
     * is successfully validated on the host's side
     * @type {boolean}
     */
    isValidatedOnHost = true;

    /**
     * Parameter that determines if filtering for url is enabled
     * @type {boolean}
     */
    isFilteringEnabled = true;

    init = () => {
        nativeHostApi.addMessageListener(this.nativeHostMessagesHandler);
        nativeHostApi.addInitMessageHandler(this.initMessageHandler);
    };

    /**
     * Handles init message response and updates app setup
     * @param response
     */
    initMessageHandler = (response) => {
        const { parameters } = response;
        const isAppUpToDate = versions.apiVersion <= parameters.apiVersion;
        const { isValidatedOnHost } = parameters;
        this.updateAppSetup(isAppUpToDate, isValidatedOnHost);
    };

    /**
     * Listens messages sent by native host without request
     */
    nativeHostMessagesHandler = async (message) => {
        if (!message || !message.appState) {
            return;
        }

        this.updateAppState(message.appState);
    };

    getAppState = () => {
        return {
            isInstalled: this.isInstalled,
            isRunning: this.isRunning,
            isProtectionEnabled: this.isProtectionEnabled,
            locale: this.locale,
            isAuthorized: this.isAuthorized,
            isAppUpToDate: this.isAppUpToDate,
            isValidatedOnHost: this.isValidatedOnHost,
            isFilteringEnabled: this.isFilteringEnabled,
        };
    };

    /**
     *
     * @param isFilteringEnabled
     */
    setIsFilteringEnabled = (isFilteringEnabled) => {
        this.isFilteringEnabled = isFilteringEnabled;
    };

    /**
     * Sets isInstalled, which is required
     * @param {boolean} isInstalled
     */
    setIsInstalled = (isInstalled) => {
        if (isInstalled === undefined) {
            throw new Error('"isInstalled" can\'t be undefined');
        }
        this.isInstalled = isInstalled;
    };

    /**
     * Sets required value isRunning
     * @param {boolean} isRunning
     */
    setIsRunning = (isRunning) => {
        if (isRunning === undefined) {
            throw new Error('"isRunning" can\'t be undefined');
        }
        this.isRunning = isRunning;
    };

    /**
     * Sets isProtectionEnabled
     * @param {boolean} isProtectionEnabled
     */
    setIsProtectionEnabled = (isProtectionEnabled) => {
        if (isProtectionEnabled === undefined) {
            throw new Error('"isProtectionEnabled" can\'t be undefined');
        }
        this.isProtectionEnabled = isProtectionEnabled;
    };

    /**
     * Sets locale get from the app
     * This param is not required
     * @param {string|undefined} locale
     */
    setLocale = (locale) => {
        if (locale === undefined) {
            return;
        }
        this.locale = locale;
    };

    /**
     * Sets isAuthorized flag from the app
     * This param is not required, consider user always authorized, unless this param wasn't set
     * @param {boolean} isAuthorized
     */
    setIsAuthorized = (isAuthorized) => {
        if (isAuthorized === undefined) {
            return;
        }
        this.isAuthorized = isAuthorized;
    };

    setIsAppUpToDate = (isAppUpToDate) => {
        this.isAppUpToDate = isAppUpToDate;
    };

    setIsValidatedOnHost = (isValidatedOnHost) => {
        this.isValidatedOnHost = isValidatedOnHost;
    };

    updateAppState = (appState) => {
        const {
            isInstalled,
            isRunning,
            isProtectionEnabled,
            locale,
            isAuthorized,
        } = appState;

        this.setIsInstalled(isInstalled);
        this.setIsRunning(isRunning);
        this.setIsProtectionEnabled(isProtectionEnabled);
        this.setLocale(locale);
        this.setIsAuthorized(isAuthorized);

        this.notifyModules();
    };

    notifyModules = async (tab) => {
        // Notify browser action tab about changed state
        notifier.notifyListeners(notifier.types.STATE_UPDATED, tab);

        // Notify popup about changed state
        await browserApi.runtime.sendMessage({
            type: MESSAGE_TYPES.STATE_UPDATED,
            data: this.getAppState(), // TODO take data format from getPopupData
        });
    };

    // TODO update this values from another place
    updateAppSetup = (isAppUpToDate, isValidatedOnHost) => {
        this.setIsAppUpToDate(isAppUpToDate);
        this.setIsValidatedOnHost(isValidatedOnHost);

        this.notifyModules();
    };

    isAppWorking() {
        return [
            this.isInstalled,
            this.isRunning,
            this.isProtectionEnabled,
            this.isAppUpToDate,
            this.isValidatedOnHost,
        ].every((state) => state === true);
    }

    // TODO consider moving this requests into provider
    getCurrentFilteringState = async (tab) => {
        const { url } = tab;
        const { port } = getUrlProps(url);
        const response = await nativeHostApi.getCurrentFilteringState(url, port);
        this.updateAppState(response.appState); // TODO may be there won't be reason to update
        return response.parameters;
    };

    getUpdateStatusInfo() {
        return {
            isAppUpToDate: this.isAppUpToDate,
            isValidatedOnHost: this.isValidatedOnHost,
        };
    }

    setProtectionStatus = async (isEnabled) => {
        const response = await nativeHostApi.setProtectionStatus(isEnabled);
        this.updateAppState(response.appState); // TODO consider removing
        return response.appState;
    };
}

export default new State();
