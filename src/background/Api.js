import nanoid from 'nanoid';
import browser from 'webextension-polyfill';
import { HostResponseTypes, HostTypes } from '../lib/types';
import browserApi from './browserApi';
import versions from './versions';
import log from '../lib/logger';

class Api {
    isAppUpdated = false;

    isExtensionUpdated = false;

    initHandler = (response) => {
        const { parameters } = response;
        if (parameters && parameters.isValidatedOnHost) {
            if (parameters.isValidatedOnHost === false) {
                // TODO: find out the format of version to compare them correctly
                this.isAppUpdated = (versions.apiVersion >= parameters.apiVersion);
                this.isExtensionUpdated = (versions.version >= parameters.version);
            } else {
                this.isAppUpdated = true;
                this.isExtensionUpdated = true;
            }
            adguard.isAppUpdated = this.isAppUpdated;
            adguard.isExtensionUpdated = this.isExtensionUpdated;
        }
        return browserApi.runtime.sendMessage(response);
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

    makeRequest = async (params) => {
        log.info(params);
        const requestId = nanoid();
        return new Promise((resolve, reject) => {
            this.port.postMessage({ id: requestId, ...params });
            // eslint-disable-next-line consistent-return
            const messageHandler = ({ id, response, data }) => {
                if (id === requestId) {
                    this.port.onMessage.removeListener(messageHandler);
                    setTimeout(() => reject(new Error('error')), 1000);

                    if (response === HostResponseTypes.error) {
                        this.deinit();
                        return reject(new Error('error'));
                    }

                    if (response === HostResponseTypes.ok) {
                        return resolve(data);
                    }
                }
            };
            this.port.onMessage.addListener(messageHandler);
        });
    };
}


const api = new Api();

export default api;
