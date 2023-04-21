import { nanoid } from 'nanoid';
import AbstractApi from './AbstractApi';
import log from '../../lib/logger';
import versions from '../versions';
import {
    ADG_PREFIX,
    ASSISTANT_TYPES,
    CUSTOM_REQUEST_PREFIX,
    REQUEST_TYPES,
} from '../../lib/types';

let hostData = {
    result: 'ok',
    version: '7.3.2496',
    apiVersion: '3',
    isValidatedOnHost: true,
    reportUrl: 'https://link.adtidy.org/forward.html?action=report&from=popup&app=browser_assistant&url=http://example.org',
    appState: {
        isRunning: true,
        isProtectionEnabled: true,
        isLicenseExpired: false,
        isInstalled: true,
        isAuthorized: true,
        locale: 'ru',
    },
    currentFilteringState: {
        isFilteringEnabled: true,
        isHttpsFilteringEnabled: true,
        isPageFilteredByUserFilter: false,
        blockedAdsCount: 180,
        totalBlockedCount: 1234,
        originalCertIssuer: 'RapidSSL RSA CA',
        originalCertStatus: 'valid',
    },
};

const observer = (() => {
    const callbacks = [];
    const subscribe = (cb) => {
        if (callbacks.includes(cb)) {
            return;
        }
        callbacks.push(cb);
    };

    const notify = (prop, value) => {
        callbacks.forEach((cb) => {
            cb(prop, value);
        });
    };

    /**
     * Checks if value isPrimitive
     * @param value
     * @returns {boolean}
     */
    const isPrimitive = (value) => {
        return (value !== Object(value));
    };

    /**
     * Traces sets to the properties in the object
     * @param obj
     * @returns {*}
     */
    const traceChanges = (obj) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(obj)) {
            if (!isPrimitive(obj[key])) {
                // eslint-disable-next-line no-param-reassign
                obj[key] = traceChanges(obj[key]);
            }
        }

        const handler = {
            set(...args) {
                const [, prop, value] = args;
                notify(prop, value);
                Reflect.set(...args);
            },
        };

        return new Proxy(obj, handler);
    };

    return {
        subscribe,
        notify,
        traceChanges,
    };
})();

hostData = observer.traceChanges(hostData);
global.hostData = hostData;

/**
 * Async function waiting for timeout
 * @param timeout
 * @returns {Promise<void>}
 */
const sleep = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, timeout);
    });
};

/**
 * Generates response similar to the real native host response
 * @param {string} type - request type
 * @param {boolean} async - boolean flag to generate non async response,
 *  used to handle subscribed changes
 */
const generateResponse = async (type, async = true) => {
    if (async) {
        await sleep(500);
    }

    const response = {
        id: nanoid(),
    };

    switch (type) {
        case REQUEST_TYPES.init: {
            return {
                ...response,
                appState: hostData.appState,
                parameters: {
                    version: hostData.version,
                    apiVersion: hostData.apiVersion,
                    isValidatedOnHost: hostData.isValidatedOnHost,
                },
            };
        }
        case REQUEST_TYPES.getCurrentAppState: {
            return {
                ...response,
                appState: hostData.appState,
            };
        }
        case REQUEST_TYPES.getCurrentFilteringState: {
            return {
                ...response,
                appState: hostData.appState,
                parameters: hostData.currentFilteringState,
            };
        }
        case REQUEST_TYPES.setProtectionStatus: {
            return {
                ...response,
                appState: hostData.appState,
            };
        }
        case REQUEST_TYPES.setFilteringStatus: {
            return {
                ...response,
                appState: hostData.appState,
            };
        }
        case REQUEST_TYPES.addRule: {
            return {
                ...response,
                appState: hostData.appState,
            };
        }
        case REQUEST_TYPES.removeRule: {
            return {
                ...response,
                appState: hostData.appState,
            };
        }
        case REQUEST_TYPES.removeCustomRules: {
            return {
                ...response,
                appState: hostData.appState,
            };
        }
        case REQUEST_TYPES.openOriginalCert: {
            return {
                ...response,
                appState: hostData.appState,
            };
        }
        case REQUEST_TYPES.reportSite: {
            return {
                ...response,
                parameters: {
                    reportUrl: hostData.reportUrl,
                },
            };
        }
        case REQUEST_TYPES.openFilteringLog: {
            return {
                ...response,
                appState: hostData.appState,
            };
        }
        case REQUEST_TYPES.openSettings: {
            return {
                ...response,
                appState: hostData.appState,
            };
        }
        case REQUEST_TYPES.updateApp: {
            return {
                ...response,
                appState: hostData.appState,
            };
        }
        case REQUEST_TYPES.pauseFiltering: {
            return {
                ...response,
                appState: hostData.appState,
            };
        }
        default:
            log.error(`Incorrect request type received: "${type}"`);
            throw new Error(`Incorrect request type received: "${type}"`);
    }
};

export class StubHostApi extends AbstractApi {
    listeners = [];

    constructor(nativeHostMessagesHandler, initMessageHandler) {
        super();
        this.initModule(nativeHostMessagesHandler, initMessageHandler);
        // add stubHostApi to global to debug via background page's console
        global.stubHostApi = this;
    }

    async initModule(nativeHostMessagesHandler, initMessageHandler) {
        this.addMessageListener(nativeHostMessagesHandler);
        this.addInitMessageHandler(initMessageHandler);
        try {
            await this.connect();
        } catch (e) {
            log.debug(e);
        }
    }

    /**
     * Distributes messages to the listeners
     * @param incomingMessage
     * @returns {Promise<void>}
     */
    incomingMessageHandler = async (incomingMessage) => {
        log.debug(`response ${incomingMessage.id}`, incomingMessage);

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
        observer.subscribe(async () => {
            const message = await generateResponse(REQUEST_TYPES.getCurrentAppState, false);
            this.incomingMessageHandler(message);
        });
        await this.sendInitialRequest(false);
    };

    sendInitialRequest = async (shouldReconnect) => {
        const { version, apiVersion, userAgent } = versions;
        const response = await this.init({ version, userAgent, apiVersion }, shouldReconnect);
        this.initMessageHandler(response);
    };

    /**
     * Disconnect from the native host
     */
    disconnect = () => {
        log.debug('Disconnecting from native host');
    };

    /**
     * Reconnect to the native host
     */
    reconnect = async () => {
        log.debug('Trying to reconnect to native host...');
        this.disconnect();
        await this.connect();
    };

    /**
     * Makes request with reconnection by default
     * @param params
     * @param tryReconnect - by default function retries to reconnect
     * @returns {Promise<*>}
     */
    makeRequest = async (params, tryReconnect = true) => {
        try {
            return await this.makeRequestOnce(params);
        } catch (e) {
            if (tryReconnect) {
                log.debug('Was unable to send request');
                try {
                    await this.reconnect();
                    return await this.makeRequestOnce(params);
                } catch (e) {
                    log.debug('Was unable to reconnect to the native host');
                    throw e;
                }
            }
            throw (e);
        }
    };

    makeRequestOnce = async (params) => {
        const id = `${ADG_PREFIX}_${CUSTOM_REQUEST_PREFIX}_${nanoid()}`;
        log.info(`Sending request: ${id}`, params);
        const { type } = params;
        return generateResponse(type);
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
        return this.makeRequest({
            type: REQUEST_TYPES.init,
            parameters: {
                version,
                apiVersion,
                userAgent,
                type: ASSISTANT_TYPES.nativeAssistant,
            },
        }, tryReconnect);
    };

    /**
     * Returns current app state
     */
    getCurrentAppState = async () => {
        const response = await this.makeRequest({
            type: REQUEST_TYPES.getCurrentAppState,
        });
        if (!response || !response.appState) {
            throw new Error('Wrong data scheme received');
        }
        return response.appState;
    };

    /**
     * Returns filtering state for url, used to get state of current tab
     * @param {string} url
     * @param {number} port
     * @param {boolean} forceStartApp
     */
    getCurrentFilteringState = (url, port, forceStartApp = false) => {
        return this.makeRequest({
            type: REQUEST_TYPES.getCurrentFilteringState,
            parameters: { url, port, forceStartApp },
        });
    };

    /**
     * @param {boolean} isEnabled
     */
    setProtectionStatus = (isEnabled) => this.makeRequest({
        type: REQUEST_TYPES.setProtectionStatus,
        parameters: { isEnabled },
    });

    /**
     * Sets filtering status
     * @param {boolean} isEnabled
     * @param {boolean} isHttpsEnabled
     * @param {string} url
     */
    setFilteringStatus = (isEnabled, isHttpsEnabled, url) => this.makeRequest({
        type: REQUEST_TYPES.setFilteringStatus,
        parameters: { isEnabled, isHttpsEnabled, url },
    });

    /**
     * Sends request to add rule in the app
     * @param {string} ruleText
     * @returns {Promise<object>}
     */
    addRule = (ruleText) => this.makeRequest({
        type: REQUEST_TYPES.addRule,
        parameters: { ruleText },
    });

    /**
     * Sends request to remove all custom rules for the current url
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
     * Sends request to the app to open window with certificate description
     * @param {string} domain
     * @param {number} port
     * @returns {Promise<object>}
     */
    openOriginalCert = (domain, port) => this.makeRequest({
        type: REQUEST_TYPES.openOriginalCert,
        parameters: { domain, port },
    });

    /**
     * Sends request to the app to generate report url
     * @param {string} url
     * @param {string} referrer
     * @returns {Promise<object>}
     */
    reportSite = (url, referrer) => this.makeRequest({
        type: REQUEST_TYPES.reportSite,
        parameters: {
            url,
            referrer,
            userAgent: versions.userAgent,
        },
    });

    /**
     * Sends message to open filtering log
     */
    openFilteringLog = () => this.makeRequest({
        type: REQUEST_TYPES.openFilteringLog,
    });

    /**
     * Sends message to open settings
     */
    openSettings = () => this.makeRequest({
        type: REQUEST_TYPES.openSettings,
    });

    /**
     * Sends message to update app
     */
    updateApp = () => this.makeRequest({
        type: REQUEST_TYPES.updateApp,
    });

    /**
     * Sends message to pause filtering
     * @param {string} url
     * @param {number} timeout
     * @returns {Promise<object>}
     */
    pauseFiltering = (url, timeout) => this.makeRequest({
        type: REQUEST_TYPES.pauseFiltering,
        parameters: { url, timeout },
    });
}
