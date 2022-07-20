/* eslint-disable @typescript-eslint/no-unused-vars */
const notImplemented = (functionName) => {
    return new Error(`Method "${functionName}" is not implemented`);
};

/**
 * Abstract class used to reflect methods used in the native host api
 */
export default class AbstractApi {
    listeners = [];

    async initModule() {
        throw notImplemented('initModule');
    }

    /**
     * Distributes messages to the listeners
     * @param incomingMessage
     * @returns {Promise<void>}
     */
    incomingMessageHandler = async (incomingMessage) => {
        throw notImplemented('incomingMessageHandler');
    };

    /**
     * Adds listener to the listeners list
     * @param {function} listener
     */
    addMessageListener = (listener) => {
        throw notImplemented('addMessageListener');
    };

    /**
     * Removes listener from listeners list
     * @param {function} listener
     */
    removeMessageListener = (listener) => {
        throw notImplemented('removeMessageListener');
    };

    /**
     * Is called on connection or reconnection
     * @param handler
     */
    addInitMessageHandler = (handler) => {
        throw notImplemented('addInitMessageHandler');
    };

    /**
     * Connect to the native host
     */
    connect = async () => {
        throw notImplemented('connect');
    };

    sendInitialRequest = async (shouldReconnect) => {
        throw notImplemented('sendInitialRequest');
    };

    /**
     * Disconnect from the native host
     */
    disconnect = () => {
        throw notImplemented('disconnect');
    };

    /**
     * Reconnect to the native host
     */
    reconnect = async () => {
        throw notImplemented('reconnect');
    };

    /**
     * Makes request
     * @param params
     * @param tryReconnect - by default function retries to reconnect
     * @returns {Promise<unknown>}
     */
    makeRequest = async (params, tryReconnect = true) => {
        throw notImplemented('makeRequest');
    };

    makeRequestOnce = async (params) => {
        throw notImplemented('makeRequestOnce');
    };

    /**
     * Sends initial request to the native host
     * @param version
     * @param userAgent
     * @param apiVersion
     * @param tryReconnect
     * @returns {Promise<*>}
     */
    init = ({ version, userAgent, apiVersion }, tryReconnect = false) => {
        throw notImplemented('init');
    };

    /**
     * Returns current app state
     */
    getCurrentAppState = async () => {
        throw notImplemented('getCurrentAppState');
    };

    /**
     * Returns filtering state for url, used to get state of current tab
     * @param {string} url
     * @param {number} port
     * @param {boolean} forceStartApp
     */
    getCurrentFilteringState = (url, port, forceStartApp = false) => {
        throw notImplemented('getCurrentFilteringState');
    };

    /**
     * @param {boolean} isEnabled
     */
    setProtectionStatus = (isEnabled) => {
        throw notImplemented('setProtectionStatus');
    };

    /**
     * Sets filtering status
     * @param {boolean} isEnabled
     * @param {boolean} isHttpsEnabled
     * @param {string} url
     */
    setFilteringStatus = (isEnabled, isHttpsEnabled, url) => {
        throw notImplemented('setFilteringStatus');
    };

    /**
     * @param {string} ruleText
     * @returns {Promise<object>}
     */
    addRule = (ruleText) => {
        throw notImplemented('addRule');
    };

    /**
     * @param {string} url
     * @returns {Promise<object>}
     */
    removeCustomRules = (url) => {
        throw notImplemented('removeCustomRules');
    };

    /**
     * @param {string} domain
     * @param {number} port
     * @returns {Promise<object>}
     */
    openOriginalCert = (domain, port) => {
        throw notImplemented('openOriginalCert');
    };

    /**
     * @param {string} url
     * @param {string} referrer
     * @returns {Promise<object>}
     */
    reportSite = (url, referrer) => {
        throw notImplemented('reportSite');
    };

    /**
     * Sends message to open filtering log
     */
    openFilteringLog = () => {
        throw notImplemented('openFilteringLog');
    };

    /**
     * Sends message to open settings
     */
    openSettings = () => {
        throw notImplemented('openSettings');
    };

    /**
     * Sends message to update app
     */
    updateApp = () => {
        throw notImplemented('updateApp');
    };

    /**
     * Sends message to pause filtering
     * @param {string} url
     * @param {number} timeout
     * @returns {Promise<object>}
     */
    pauseFiltering = (url, timeout) => {
        throw notImplemented('pauseFiltering');
    };
}
