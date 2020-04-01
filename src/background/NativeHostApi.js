import browser from 'webextension-polyfill';
import nanoid from 'nanoid';
import log from '../lib/logger';
import versions from './versions';
import {
    ADG_PREFIX,
    ASSISTANT_TYPES,
    CUSTOM_REQUEST_PREFIX,
    HOST_TYPES,
    MESSAGE_TYPES,
    REQUEST_TYPES,
} from '../lib/types';

class NativeHostApi {
    MAX_RETRY_TIMES = 5;

    retryTimes = this.MAX_RETRY_TIMES;

    listeners = [];

    constructor() {
        this.connect();
    }

    /**
     * Distributes messages to the listeners
     * @param incomingMessage
     * @returns {Promise<void>}
     */
    incomingMessageHandler = async (incomingMessage) => {
        log.info(`response ${incomingMessage.id}`, incomingMessage);

        // Ignore requests without identifying prefix ADG
        if (!incomingMessage.requestId.startsWith(ADG_PREFIX)) {
            return;
        }

        // TODO seems like unnecessary, consider removing
        // Ignore requests with single request prefix, they have their own handlers
        if (incomingMessage.requestId.includes(CUSTOM_REQUEST_PREFIX)) {
            return;
        }

        // Call listener callbacks
        if (this.listeners.length > 0) {
            this.listeners.forEach((listener) => {
                listener.call(null, incomingMessage);
            });
        }
    };

    /**
     * Adds listener to the listeners list
     * @param {function} listener
     */
    addMessageListener = (listener) => {
        this.listeners = [...this.listeners, listener];
    };

    /**
     * Removes listener from listeners list
     * @param {function} listener
     */
    removeMessageListener = (listener) => {
        this.listeners = this.listeners.filter((l) => l !== listener);
    };

    /**
     * Is called on connection or reconnection
     * @param handler
     */
    addInitMessageHandler = (handler) => {
        this.initMessageHandler = handler;
    };

    /**
     * Connect to the native host
     */
    connect = async () => {
        log.info('Connecting to the native host');
        this.port = browser.runtime.connectNative(HOST_TYPES.browserExtensionHost);

        this.port.onMessage.addListener(this.incomingMessageHandler);

        this.port.onDisconnect.addListener(
            async () => {
                if (browser.runtime.lastError) {
                    log.info(browser.runtime.lastError.message);
                }
                await this.reconnectWithRetry();
            }
        );

        await this.sendInitialRequest();
    };

    sendInitialRequest = async () => {
        const { version, apiVersion, userAgent } = versions;
        const response = await this.init({ version, userAgent, apiVersion });
        this.initMessageHandler(response);
    };

    /**
     * Disconnect from the native host
     */
    disconnect = () => {
        log.info('Disconnecting from native host');
        this.port.disconnect();
        this.port.onMessage.removeListener(this.incomingMessageHandler);
    };

    /**
     * Reconnect to the native host
     */
    reconnect = async () => {
        // TODO on reconnection send message to the popup to start reloading
        // await browserApi.runtime.sendMessage({ type: MESSAGE_TYPES.START_RELOAD });
        this.disconnect();
        await this.connect();
    };

    reconnectWithRetry = async () => {
        this.retryTimes -= 1;

        if (this.retryTimes) {
            await this.reconnect();
        } else {
            this.disconnect();
            // TODO figure out purpose of this function
            //  Seems like it is used in order to stop loading loader on the browser action popup
            // await browserApi.runtime.sendMessage({ type: message });

            // TODO notify state module about error via listeners
            this.retryTimes = this.MAX_RETRY_TIMES;
            log.error('Disconnected from native host: could not find correct app manifest or host is not responding');
        }
    };

    makeRequest = async (params) => {
        const RESPONSE_TIMEOUT_MS = 60 * 1000;

        // Use CUSTOM_REQUEST_PREFIX in order to ignore this requests in the income message handler
        const id = `${ADG_PREFIX}_${CUSTOM_REQUEST_PREFIX}_${nanoid()}`;

        log.info(`Sending request: ${id}`, params);

        return new Promise((resolve, reject) => {
            const messageHandler = (msg) => {
                const { requestId, result } = msg;

                const timerId = setTimeout(() => {
                    reject(new Error('Native host is not responding.'));
                    this.port.onMessage.removeListener(messageHandler);
                }, RESPONSE_TIMEOUT_MS);

                if (id === requestId) {
                    this.port.onMessage.removeListener(messageHandler);
                    clearTimeout(timerId);

                    if (result === MESSAGE_TYPES.OK) {
                        return resolve(msg);
                    }

                    if (result === MESSAGE_TYPES.ERROR) {
                        this.reconnectWithRetry();
                        return reject(new Error(`Native host responded with status: ${result}.`));
                    }
                }
                return '';
            };

            try {
                this.port.postMessage({ id, ...params });
            } catch (error) {
                log.error(error);
                this.port.onMessage.removeListener(messageHandler);
                // TODO after successful reconnection send message again otherwise reject error
                this.reconnectWithRetry();
            }

            this.port.onMessage.addListener(messageHandler);
        });
    };

    /**
     * Sends initial request to the native host
     * @param {string} version
     * @param {string} userAgent
     * @param {string} apiVersion
     * @returns {Promise<unknown>}
     */
    init = ({ version, userAgent, apiVersion }) => {
        return this.makeRequest({
            type: REQUEST_TYPES.init,
            parameters: {
                version,
                apiVersion,
                userAgent,
                type: ASSISTANT_TYPES.nativeAssistant,
            },
        });
    };

    /**
     * @returns {Promise<object>}
     */
    getCurrentAppState = () => this.makeRequest({
        type: REQUEST_TYPES.getCurrentAppState,
    });

    /**
     * Returns filtering state for url, used to get state of current tab
     * @param {string} url
     * @param {number} port
     * @param {boolean} forceStartApp
     * @returns {Promise<object>}
     */
    getCurrentFilteringState = (url, port, forceStartApp = false) => {
        return this.makeRequest({
            type: REQUEST_TYPES.getCurrentFilteringState,
            parameters: { url, port, forceStartApp },
        });
    };

    /**
     * @param {boolean} isEnabled
     * @returns {Promise<object>}
     */
    setProtectionStatus = (isEnabled) => this.makeRequest({
        type: REQUEST_TYPES.setProtectionStatus,
        parameters: { isEnabled },
    });

    /**
     * @param {object} parameters
     * @param {boolean} parameters.isEnabled
     * @param {boolean} parameters.isHttpsEnabled
     * @param {string} parameters.url
     * @returns {Promise<object>}
     */
    setFilteringStatus = ({ isEnabled, isHttpsEnabled, url }) => this.makeRequest({
        type: REQUEST_TYPES.setFilteringStatus,
        parameters: { isEnabled, isHttpsEnabled, url },
    });

    /**
     * @param {object} parameters
     * @param {string} parameters.ruleText
     * @returns {Promise<object>}
     */
    addRule = ({ ruleText }) => this.makeRequest({
        type: REQUEST_TYPES.addRule,
        parameters: { ruleText },
    });

    /**
     * @param {object} parameters
     * @param {string} parameters.ruleText
     * @returns {Promise<object>}
     */
    removeRule = ({ ruleText }) => this.makeRequest({
        type: REQUEST_TYPES.removeRule,
        parameters: { ruleText },
    });

    /**
     * @param {string} url
     * @returns {Promise<object>}
     */
    removeCustomRules = (url) => {
        return this.makeRequest({
            type: REQUEST_TYPES.removeCustomRules,
            parameters: { url },
        });
    };

    /**
     * @param {object} parameters
     * @param {string} parameters.domain
     * @param {number} parameters.port
     * @returns {Promise<object>}
     */
    openOriginalCert = ({ domain, port }) => this.makeRequest({
        type: REQUEST_TYPES.openOriginalCert,
        parameters: { domain, port },
    });

    /**
     * @param {object} parameters
     * @param {string} parameters.url
     * @param {string} parameters.referrer
     * @returns {Promise<object>}
     */
    reportSite = ({ url, referrer }) => this.makeRequest({
        type: REQUEST_TYPES.reportSite,
        parameters: {
            url,
            referrer,
            userAgent: versions.userAgent,
        },
    });

    /**
     * @returns {Promise<object>}
     */
    openFilteringLog = () => this.makeRequest({
        type: REQUEST_TYPES.openFilteringLog,
    });

    /**
     * @returns {Promise<object>}
     */
    openSettings = () => this.makeRequest({
        type: REQUEST_TYPES.openSettings,
    });

    /**
     * @returns {Promise<object>}
     */
    updateApp = () => this.makeRequest({
        type: REQUEST_TYPES.updateApp,
    });
}

const nativeHostApi = new NativeHostApi();

export default nativeHostApi;
