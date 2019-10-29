import nanoid from 'nanoid';
import browser from 'webextension-polyfill';

const port = browser.runtime.connectNative('native_browser_assistant');

port.onMessage.addListener((response) => {
    const {
        id, data, parameters, appState, result, requestId,
    } = response;
    console.log(`ResponseId = ${id} - Received: id = ${requestId}, parameters = ${JSON.stringify(parameters)}, appState = ${JSON.stringify(appState)}, result = ${result}, data = ${data || 'no additional data received'}`);
    browser.runtime.sendMessage(response);
});

export class Api {
    async makeRequest(params) {
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
