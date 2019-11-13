import nanoid from 'nanoid';
import browser from 'webextension-polyfill';
import { HostResponseTypes, HostTypes, ResponseTypes } from '../lib/types';
import browserApi from './browserApi';
import versions from './versions';
import log from '../lib/logger';

class Api {
    initHandler = (response) => {
        log.info('response ', response);
        const { parameters } = response;

        if (parameters && response.requestId.startsWith(ResponseTypes.INIT)) {
            adguard.isAppUpdated = (versions.apiVersion >= parameters.apiVersion);
            adguard.isExtensionUpdated = parameters.isValidatedOnHost;
            return;
        }

        if (response.requestId.startsWith(ResponseTypes.APP_STATE_RESPONSE_MESSAGE)) {
            return;
        }

        browserApi.runtime.sendMessage(response);
    };

    init = () => {
        log.info('init');
        this.port = browser.runtime.connectNative(HostTypes.nativeBrowserAssistant);
        this.port.onMessage.addListener(this.initHandler);
        return this.port;
    };

    deinit = () => {
        log.info('deinit');
        this.port.disconnect();
        this.port.onMessage.removeListener(this.initHandler);
        return this.port;
    };

    makeRequest = async (params, idPrefix) => {
        log.info('request ', params);
        const id = idPrefix ? `${idPrefix}_${nanoid()}` : nanoid();
        return new Promise((resolve, reject) => {
            this.port.postMessage({ id, ...params });
            const messageHandler = ({ requestId, result, data }) => {
                const pendingTimer = setTimeout(() => reject(new Error('Native host is not responding.')), 60000);

                if (id === requestId) {
                    this.port.onMessage.removeListener(messageHandler);
                    clearTimeout(pendingTimer);

                    if (result === HostResponseTypes.error) {
                        this.deinit();
                        return reject(new Error(`Native host responded with status: ${result}.`));
                    }

                    if (result === HostResponseTypes.ok) {
                        return resolve(data);
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
