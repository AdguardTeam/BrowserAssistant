import nanoid from 'nanoid';
import browser from 'webextension-polyfill';
import {
    AssistantTypes, HostResponseTypes, HostTypes, RequestTypes, ResponseTypes,
} from '../lib/types';
import browserApi from './browserApi';
import versions from './versions';
import log from '../lib/logger';

class Api {
    isAppUpdated = true;

    isExtensionUpdated = true;

    retryTimes = 5;

    initHandler = (response) => {
        log.info('response ', response);
        const { parameters } = response;

        if (parameters && response.requestId.startsWith(ResponseTypes.INIT)) {
            this.isAppUpdated = (versions.apiVersion >= parameters.apiVersion);
            adguard.isAppUpdated = this.isAppUpdated;

            this.isExtensionUpdated = parameters.isValidatedOnHost;
            adguard.isExtensionUpdated = this.isExtensionUpdated;
        }

        if (response.requestId.startsWith(ResponseTypes.APP_STATE_RESPONSE_MESSAGE)) {
            return;
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
                this.retryTimes = 5;

                log.error('Disconnected from native host');
            }
        });

        this.initRequest();
        return this.port;
    };

    initRequest = () => {
        this.makeRequest({
            type: RequestTypes.init,
            parameters: {
                ...versions,
                type: AssistantTypes.nativeAssistant,
            },
        }, ResponseTypes.INIT);
    };

    deinit = () => {
        log.info('deinit');
        this.port.disconnect();
        this.port.onMessage.removeListener(this.initHandler);
    };

    reinit = () => {
        this.deinit();
        this.init();
    };

    makeRequest = async (params, idPrefix) => {
        log.info('request ', params);
        const id = idPrefix ? `${idPrefix}_${nanoid()}` : nanoid();
        return new Promise((resolve, reject) => {
            try {
                this.port.postMessage({ id, ...params });
            } catch (e) {
                if (this.retryTimes) {
                    this.reinit();
                } else {
                    this.deinit();
                }
            }

            const messageHandler = (msg) => {
                const { requestId, result } = msg;

                const RESPONSE_TIMEOUT_MS = 60 * 1000;

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
            this.port.onMessage.addListener(messageHandler);
        });
    };
}


const api = new Api();

export default api;
