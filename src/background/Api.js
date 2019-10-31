import nanoid from 'nanoid';
import browser from 'webextension-polyfill';
import { HostResponseTypes } from '../lib/types';

export class Api {
    static get port() {
        const port = browser.runtime.connectNative('native_browser_assistant');
        return port;
    }

    static init() {
        const { port } = Api;
        port.onMessage.addListener((response) => {
            browser.runtime.sendMessage(response);
        });

        return port;
    }

    async makeRequest(params) {
        const { port } = Api;
        const requestId = nanoid();
        return new Promise((resolve, reject) => {
            port.postMessage({ id: requestId, ...params });
            // eslint-disable-next-line consistent-return
            const messageHandler = ({ id, response, data }) => {
                if (id === requestId) {
                    port.onMessage.removeListener(messageHandler);
                    if (response === HostResponseTypes.error) {
                        return reject(new Error('error'));
                    }
                    if (response === HostResponseTypes.ok) {
                        return resolve(data);
                    }
                }
            };
            port.onMessage.addListener(messageHandler);
        });
    }
}
