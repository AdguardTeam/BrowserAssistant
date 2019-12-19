import nanoid from 'nanoid';
import browser from 'webextension-polyfill';
import {
    AssistantTypes,
    BACKGROUND_COMMANDS,
    HostResponseTypes,
    HostTypes,
    RequestTypes,
    ResponseTypesPrefixes,
} from '../lib/types';
import browserApi from './browserApi';
import versions from './versions';
import log from '../lib/logger';

class Api {
    isAppUpToDate = true;

    isExtensionUpdated = true;

    retryTimes = 5;

    initHandler = (response) => {
        log.info(`response ${response.id}`, response);
        const { parameters } = response;

        // Ignore requests without identifying prefix ADG
        if (!response.requestId.startsWith(ResponseTypesPrefixes.ADG)) {
            return;
        }

        if (parameters && response.requestId.startsWith(ResponseTypesPrefixes.ADG_INIT)) {
            this.isAppUpToDate = (versions.apiVersion <= parameters.apiVersion);
            adguard.isAppUpToDate = this.isAppUpToDate;

            this.isExtensionUpdated = parameters.isValidatedOnHost;
            adguard.isExtensionUpdated = this.isExtensionUpdated;
        }

        browserApi.runtime.sendMessage(response);
    };

    init = () => {
        log.info('init');
        this.port = browser.runtime.connectNative(HostTypes.browserExtensionHost);
        this.port.onMessage.addListener(this.initHandler);

        this.port.onDisconnect.addListener(() => {
            this.retryTimes -= 1;

            if (this.retryTimes) {
                this.reinit();
            } else {
                this.deinit();
                browserApi.runtime.sendMessage(
                    { result: BACKGROUND_COMMANDS.SHOW_SETUP_INCORRECTLY }
                );
                this.retryTimes = 5;

                log.error('Disconnected from native host: could not find correct app manifest or host is not responding');
            }
        });

        this.initRequest();
        return this.port;
    };

    initRequest = async () => {
        try {
            await this.makeRequest({
                type: RequestTypes.init,
                parameters: {
                    ...versions,
                    type: AssistantTypes.nativeAssistant,
                },
            }, ResponseTypesPrefixes.INIT);
        } catch (error) {
            log.error(error.message);
        }
    };

    deinit = () => {
        log.info('deinit');
        this.port.disconnect();
        this.port.onMessage.removeListener(this.initHandler);
    };

    reinit = async () => {
        await browserApi.runtime.sendMessage({ result: BACKGROUND_COMMANDS.SHOW_RELOAD });
        this.deinit();
        this.init();
    };

    makeRequest = async (params, idPrefix) => {
        const id = idPrefix ? `ADG_${idPrefix}_${nanoid()}` : `ADG_${nanoid()}`;
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

                    if (result === HostResponseTypes.ok) {
                        return resolve(msg);
                    }

                    if (result === HostResponseTypes.error) {
                        this.reinit();
                        return reject(new Error(`Native host responded with status: ${result}.`));
                    }
                }
                return '';
            };

            try {
                this.port.postMessage({ id, ...params });
            } catch (error) {
                log.error(error.message);

                this.port.onMessage.removeListener(messageHandler);

                if (this.retryTimes) {
                    this.reinit();
                } else {
                    browserApi.runtime.sendMessage({ result: BACKGROUND_COMMANDS.CLOSE_POPUP });
                    this.deinit();
                }
            }
            this.port.onMessage.addListener(messageHandler);
        });
    };
}


const api = new Api();

export default api;
