import isEqual from 'lodash/isEqual';
import browserApi from '../lib/browserApi';
import nativeHostApi from './NativeHostApi';
import versions from './versions';
import { POPUP_MESSAGES } from '../lib/types';
import { BASE_LOCALE } from '../../tasks/langConstants';
import notifier from '../lib/notifier';
import { getUrlProps, isHttp } from '../lib/helpers';

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
        nativeHostApi.addMessageListener(this.nativeHostMessagesHandler);
        nativeHostApi.addInitMessageHandler(this.initMessageHandler);
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

    getAppState = () => {
        return this.appState;
    };

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

    // TODO where it is possible provide tab data
    notifyModules = async (tab) => {
        // Notify browser action tab about changed state
        notifier.notifyListeners(notifier.types.STATE_UPDATED, tab);

        // Notify popup about changed state
        await browserApi.runtime.sendMessage({
            type: POPUP_MESSAGES.STATE_UPDATED,
            // TODO check what kind of message returns when
            //  currentFilteringState changes in the program
            data: {
                appState: this.getAppState(),
                updateStatusInfo: this.getUpdateStatusInfo(),
                // TODO add currentFilteringState,
            },
        });
    };

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
     * Returns current filtering state or null if was unable to retrieve it
     * @param tab
     * @returns {Promise<null|*>}
     */
    getCurrentFilteringState = async (tab) => {
        const { url } = tab;
        const { port } = getUrlProps(url);
        if (!isHttp(url) || !port) {
            return null;
        }
        const response = await nativeHostApi.getCurrentFilteringState(url, port);
        this.setAppState(response.appState);
        return response.parameters;
    };

    getUpdateStatusInfo() {
        return this.updateStatusInfo;
    }

    setProtectionStatus = async (isEnabled) => {
        const response = await nativeHostApi.setProtectionStatus(isEnabled);
        this.setAppState(response.appState);
        return response.appState;
    };

    getCurrentAppState = async () => {
        let appState;
        try {
            appState = await nativeHostApi.getCurrentAppState();
        } catch (e) {
            console.log(e);
        }
        this.setAppState(appState);
        return appState;
    }
}

export default new State();
