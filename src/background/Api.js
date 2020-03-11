import nanoid from 'nanoid';
import browser from 'webextension-polyfill';
import {
    ASSISTANT_TYPES,
    BACKGROUND_COMMANDS,
    HOST_RESPONSE_TYPES,
    HOST_TYPES,
    REQUEST_TYPES,
    RESPONSE_TYPE_PREFIXES,
    SETUP_STATES,
} from '../lib/types';
import browserApi from './browserApi';
import versions from './versions';
import log from '../lib/logger';

const MAX_RETRY_TIMES = 5;

class Api {
    isAppUpToDate = true;

    isExtensionUpdated = true;

    retryTimes = MAX_RETRY_TIMES;

    responsesHandler = async (response) => {
        log.info(`response ${response.id}`, response);
        const { parameters } = response;

        // Ignore requests without identifying prefix ADG
        if (!response.requestId.startsWith(RESPONSE_TYPE_PREFIXES.ADG)) {
            return;
        }

        if (parameters && response.requestId.startsWith(RESPONSE_TYPE_PREFIXES.ADG_INIT)) {
            this.isAppUpToDate = (versions.apiVersion <= parameters.apiVersion);

            await browserApi.runtime.sendMessage({
                result: BACKGROUND_COMMANDS.SHOW_SETUP_INCORRECT,
            });
            await browser.storage.local.set({ [SETUP_STATES.isAppUpToDate]: this.isAppUpToDate });

            this.isExtensionUpdated = parameters.isValidatedOnHost;
            await browserApi.runtime.sendMessage({
                result: BACKGROUND_COMMANDS.SHOW_SETUP_INCORRECT,
            });
            await browser.storage.local.set(
                { [SETUP_STATES.isExtensionUpdated]: this.isExtensionUpdated }
            );
        }

        await browserApi.runtime.sendMessage(response);
    };

    init = () => {
        log.info('init');
        this.port = browser.runtime.connectNative(HOST_TYPES.browserExtensionHost);
        this.port.onMessage.addListener(this.responsesHandler);

        this.port.onDisconnect.addListener(
            () => this.makeReinit(BACKGROUND_COMMANDS.SHOW_IS_NOT_INSTALLED)
        );

        this.initRequest();
        return this.port;
    };

    initRequest = async () => {
        try {
            await this.makeRequest({
                type: REQUEST_TYPES.init,
                parameters: {
                    ...versions,
                    type: ASSISTANT_TYPES.nativeAssistant,
                },
            }, RESPONSE_TYPE_PREFIXES.ADG_INIT);
        } catch (error) {
            log.error(error);
        }
    };

    deinit = () => {
        log.info('deinit');
        this.port.disconnect();
        this.port.onMessage.removeListener(this.responsesHandler);
    };

    reinit = async () => {
        await browserApi.runtime.sendMessage({ result: BACKGROUND_COMMANDS.SHOW_RELOAD });
        this.deinit();
        this.init();
    };

    makeReinit = async (message = BACKGROUND_COMMANDS.SHOW_SETUP_INCORRECT) => {
        this.retryTimes -= 1;

        if (this.retryTimes) {
            this.reinit();
        } else {
            this.deinit();
            await browserApi.runtime.sendMessage(
                { result: message }
            );
            this.retryTimes = MAX_RETRY_TIMES;

            log.error('Disconnected from native host: could not find correct app manifest or host is not responding');
        }
    };

    makeRequest = async (params, idPrefix = RESPONSE_TYPE_PREFIXES.ADG) => {
        const id = `${idPrefix}_${nanoid()}`;

        const RESPONSE_TIMEOUT_MS = 60 * 1000;
        log.info(`request ${id}`, params);

        return new Promise((resolve, reject) => {
            const messageHandler = (msg) => {
                const { requestId, result } = msg;

                const pendingTimer = setTimeout(() => {
                    reject(new Error('Native host is not responding.'));
                    this.port.onMessage.removeListener(messageHandler);
                }, RESPONSE_TIMEOUT_MS);

                if (id === requestId) {
                    this.port.onMessage.removeListener(messageHandler);
                    clearTimeout(pendingTimer);

                    if (result === HOST_RESPONSE_TYPES.ok) {
                        return resolve(msg);
                    }

                    if (result === HOST_RESPONSE_TYPES.error) {
                        this.makeReinit();
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
                this.makeReinit();
            }
            this.port.onMessage.addListener(messageHandler);
        });
    };
}


const api = new Api();

export default api;
