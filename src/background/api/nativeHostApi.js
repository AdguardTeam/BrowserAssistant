import browser from 'webextension-polyfill';
import { nanoid } from 'nanoid';

import { log } from '../../lib/logger';
import versions from '../versions';
import {
    ADG_PREFIX,
    ASSISTANT_TYPES,
    CUSTOM_REQUEST_PREFIX,
    HOST_TYPES,
    REQUEST_TYPES,
} from '../../lib/types';
import { consent } from '../consent';
import { browserApi } from '../../lib/browserApi';
import { getErrorMessage } from '../../lib/errors';

import AbstractApi from './AbstractApi';

/** Retries help Firefox Nightly on macOS where native messaging can be briefly unavailable (see AG #145). */
const NATIVE_HOST_CONNECT_ATTEMPTS_DEFAULT = 6;
/** Fewer, shorter backoffs when the native manifest is missing (avoids multi-minute “loading”). */
const NATIVE_HOST_CONNECT_ATTEMPTS_FIREFOX = 5;
const NATIVE_HOST_CONNECT_BASE_DELAY_MS_DEFAULT = 75;
const NATIVE_HOST_CONNECT_BASE_DELAY_MS_FIREFOX = 100;
const NATIVE_HOST_CONNECT_BACKOFF_CAP_MS_DEFAULT = 4000;
const NATIVE_HOST_CONNECT_BACKOFF_CAP_MS_FIREFOX = 1500;

const delay = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
});

const getNativeConnectAttempts = () => (
    browserApi.utils.isFirefoxBrowser
        ? NATIVE_HOST_CONNECT_ATTEMPTS_FIREFOX
        : NATIVE_HOST_CONNECT_ATTEMPTS_DEFAULT
);

const getNativeConnectBaseDelayMs = () => (
    browserApi.utils.isFirefoxBrowser
        ? NATIVE_HOST_CONNECT_BASE_DELAY_MS_FIREFOX
        : NATIVE_HOST_CONNECT_BASE_DELAY_MS_DEFAULT
);

/**
 * Module implements methods used to communicate with native host via native messaging
 * https://developer.chrome.com/apps/nativeMessaging
 */
export class NativeHostApi extends AbstractApi {
    listeners = [];

    constructor(nativeHostMessagesHandler, initMessageHandler) {
        super();
        this.initModule(nativeHostMessagesHandler, initMessageHandler);
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
        log.debug(`Received response: ${incomingMessage.requestId}`, incomingMessage);

        // Ignore requests without identifying prefix ADG
        if (!incomingMessage.requestId.startsWith(ADG_PREFIX)) {
            return;
        }

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
     * @param {object} port
     * @returns {string | null | undefined} chrome or firefox error
     */
    getError = (port) => browser.runtime.lastError?.message || port?.error;

    /**
     * Host closed the pipe; port is already dead — do not call disconnect().
     * Without this, Firefox keeps a stale port and later postMessage fails while "connected".
     */
    releaseDisconnectedPort = (disconnectedPort) => {
        if (!disconnectedPort || this.port !== disconnectedPort) {
            return;
        }
        try {
            this.port.onMessage.removeListener(this.incomingMessageHandler);
            this.port.onDisconnect.removeListener(this.disconnectHandler);
        } catch (e) {
            log.debug(e);
        }
        this.port = null;
        log.info('Native host port released after disconnect; next request will reconnect.');
    };

    disconnectHandler = (port) => {
        const error = this.getError(port);

        if (error) {
            log.error(`Native host disconnected: ${error}`);
        }
        this.releaseDisconnectedPort(port);
    };

    /**
     * Drops the native port and listeners. Safe when the port never fully connected.
     */
    destroyNativePort = () => {
        if (!this.port) {
            return;
        }
        try {
            this.port.onMessage.removeListener(this.incomingMessageHandler);
            this.port.onDisconnect.removeListener(this.disconnectHandler);
        } catch (e) {
            log.debug(e);
        }
        try {
            this.port.disconnect();
        } catch (e) {
            log.debug(e);
        }
        this.port = null;
    };

    /**
     * Connect to the native host
     */
    connect = async () => {
        const maxAttempts = getNativeConnectAttempts();
        const baseDelayMs = getNativeConnectBaseDelayMs();
        const backoffCapMs = browserApi.utils.isFirefoxBrowser
            ? NATIVE_HOST_CONNECT_BACKOFF_CAP_MS_FIREFOX
            : NATIVE_HOST_CONNECT_BACKOFF_CAP_MS_DEFAULT;
        const extensionId = browser.runtime.id;

        log.info(
            'Connecting to native host',
            HOST_TYPES.browserExtensionHost,
            `extensionId=${extensionId}`,
        );

        if (browserApi.utils.isFirefoxBrowser) {
            await delay(baseDelayMs);
        }

        let lastError;
        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
            this.destroyNativePort();
            try {
                // MV3: once connected, the port stays alive (unlike the usual ~30s native messaging limit).
                this.port = browser.runtime.connectNative(HOST_TYPES.browserExtensionHost);
                this.port.onMessage.addListener(this.incomingMessageHandler);
                this.port.onDisconnect.addListener(this.disconnectHandler);
                await this.sendInitialRequest(false);
                if (attempt > 1) {
                    log.info(`Native host connected on attempt ${attempt}/${maxAttempts}`);
                }
                return;
            } catch (e) {
                lastError = e;
                log.warn(
                    `Native host connect attempt ${attempt}/${maxAttempts} failed:`,
                    getErrorMessage(e),
                );
                if (attempt < maxAttempts) {
                    const backoff = baseDelayMs * (2 ** (attempt - 1));
                    await delay(Math.min(backoff, backoffCapMs));
                }
            }
        }
        this.destroyNativePort();
        throw lastError;
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
        this.destroyNativePort();
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
        const isConsentRequired = await consent.isConsentRequired();
        if (isConsentRequired && params.type !== REQUEST_TYPES.init) {
            throw new Error('Requests to native host can be send only after consent agreement received');
        }

        // Startup connect may fail on Firefox Nightly; establish port when the popup first talks to the host.
        if (params.type !== REQUEST_TYPES.init && !this.port) {
            try {
                await this.connect();
            } catch (e) {
                log.warn('Deferred native connect before request failed:', getErrorMessage(e));
                // Do not fall through: null port + makeRequestOnce caused long hangs and a second full reconnect().
                throw e;
            }
        }

        try {
            return await this.makeRequestOnce(params);
        } catch (e) {
            // Prevent reconnection for init requests, to avoid infinite loop, since reconnect calls init request
            // https://github.com/AdguardTeam/BrowserAssistant/issues/115
            if (tryReconnect && params.type !== REQUEST_TYPES.init) {
                log.debug(
                    'Was unable to send request with params:',
                    params,
                    'due to error:',
                    getErrorMessage(e),
                );
                try {
                    await this.reconnect();
                    // After reconnection, retry the request without attempting further reconnections.
                    return await this.makeRequestOnce(params);
                } catch (e) {
                    log.debug('Was unable to reconnect to the native host due to error:', getErrorMessage(e));
                    throw e;
                }
            }
            throw e;
        }
    };

    makeRequestOnce = async (params) => {
        // Requests can be executed too long time on application launch
        const RESPONSE_TIMEOUT_MS = 1000 * 60 * 5;

        const HOST_RESPONSE_TYPES = {
            OK: 'ok',
            ERROR: 'error',
        };

        // Use CUSTOM_REQUEST_PREFIX in order to ignore this requests in the incomingMessageHandler
        const id = `${ADG_PREFIX}_${CUSTOM_REQUEST_PREFIX}_${nanoid()}`;

        log.info(`Sending request: ${id}`, params);

        return new Promise((resolve, reject) => {
            let timerId;

            const errorHandler = (port) => {
                const error = this.getError(port);

                if (error) {
                    reject(error);
                }
            };

            const messageHandler = (message) => {
                const { requestId, result } = message;

                if (id === requestId) {
                    this.port.onMessage.removeListener(messageHandler);
                    this.port.onDisconnect.removeListener(errorHandler);
                    clearTimeout(timerId);

                    if (result === HOST_RESPONSE_TYPES.OK) {
                        resolve(message);
                        return;
                    }

                    if (result === HOST_RESPONSE_TYPES.ERROR) {
                        reject(new Error(`Native host responded with message: ${message.data}.`));
                    }
                }
            };

            this.port.onMessage.addListener(messageHandler);
            this.port.onDisconnect.addListener(errorHandler);

            timerId = setTimeout(() => {
                this.port.onMessage.removeListener(messageHandler);
                this.port.onDisconnect.removeListener(errorHandler);
                reject(new Error('Native host is not responding too long'));
            }, RESPONSE_TIMEOUT_MS);

            try {
                this.port.postMessage({ id, ...params });
            } catch (e) {
                reject(e);
            }
        });
    };

    /**
     * Sends initial request to the native host
     * @param parameters
     * @param {string} parameters.version
     * @param {string} parameters.userAgent
     * @param {string} parameters.apiVersion
     * @param {boolean} tryReconnect
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
     * Sets protections status of the app
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
     * @param {string} ruleText
     * @returns {Promise<object>}
     */
    addRule = (ruleText) => this.makeRequest({
        type: REQUEST_TYPES.addRule,
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
     * @param {string} domain
     * @param {number} port
     * @returns {Promise<object>}
     */
    openOriginalCert = (domain, port) => this.makeRequest({
        type: REQUEST_TYPES.openOriginalCert,
        parameters: { domain, port },
    });

    /**
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
