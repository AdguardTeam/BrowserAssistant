import nanoid from 'nanoid';
import browser from 'webextension-polyfill';
import { HostResponseTypes, HostTypes } from '../lib/types';
import browserApi from './browserApi';

class Api {
    initHandler = (response) => {
        const { parameters } = response;
        this.isValidatedOnHost = (parameters && parameters.isValidatedOnHost)
            ? parameters.isValidatedOnHost : false;
        return browserApi.runtime.sendMessage(response);
    }

    init = () => {
        console.log('init');
        this.port = browser.runtime.connectNative(HostTypes.nativeBrowserAssistant);
        this.port.onMessage.addListener(this.initHandler);
        return this.port;
    };

    deinit = () => {
        console.log('deinit');
        this.port.disconnect();
        this.port.onMessage.removeListener(this.initHandler);
        return this.port;
    };

    makeRequest = async (params) => {
        const requestId = nanoid();
        return new Promise((resolve, reject) => {
            this.port.postMessage({ id: requestId, ...params });
            // eslint-disable-next-line consistent-return
            const messageHandler = ({ id, response, data }) => {
                if (id === requestId) {
                    this.port.onMessage.removeListener(messageHandler);
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
