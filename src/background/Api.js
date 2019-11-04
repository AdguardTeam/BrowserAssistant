import nanoid from 'nanoid';
import browser from 'webextension-polyfill';
import { HostResponseTypes } from '../lib/types';
import browserApi from './browserApi/browserApiIndex';

class Api {
    initHandler(response) {
        return browserApi.runtime.sendMessage(response);
    }

    init = () => {
        this.port = browser.runtime.connectNative('native_browser_assistant');
        this.port.onMessage.addListener(this.initHandler);
        return this.port;
    };

    deinit = () => {
        this.port.disconnect();
        this.port.onMessage.removeListener(this.initHandler);
        return this.port;
    };

    makeRequest = async (params) => {
        console.log(params);
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
