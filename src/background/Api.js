import nanoid from 'nanoid';
import browser from 'webextension-polyfill';

export class Api {
    static init() {
        const port = browser.runtime.connectNative('native_browser_assistant');

        port.onMessage.addListener((response) => {
            browser.runtime.sendMessage(response);
        });

        return port;
    }

    async makeRequest(params) {
        const port = Api.init();
        const requestId = nanoid();
        return new Promise((resolve, reject) => {
            port.postMessage({ id: requestId, ...params });
            // eslint-disable-next-line consistent-return
            const messageHandler = ({ id, response, data }) => {
                if (id === requestId) {
                    port.onMessage.removeListener(messageHandler);
                    if (response === 'error') {
                        return reject(new Error('error'));
                    }
                    if (response === 'ok') {
                        return resolve(data);
                    }
                }
            };
            port.onMessage.addListener(messageHandler);
        });
    }
}
