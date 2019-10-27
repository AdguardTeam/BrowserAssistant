import nanoid from 'nanoid';
import browser from 'webextension-polyfill';
import { requestsMap } from './messaging';

const port = browser.runtime.connectNative('native_browser_assistant');

port.onMessage.addListener((response) => {
    const {
        id, data, parameters, appState, result, requestId,
    } = response;
    console.log(`ResponseId = ${id} - Received: id = ${requestId}, parameters = ${JSON.stringify(parameters)}, appState = ${JSON.stringify(appState)}, result = ${result}, data = ${data || 'no additional data received'}`);
    browser.runtime.sendMessage(response);
});

const wrapRequest = (requestName) => {
    return (params) => {
        const requestFunction = requestsMap[requestName];
        const request = requestFunction(params);
        request.id = nanoid();
        console.log('request ', request);
        port.postMessage(request);
    };
};

const wrappedRequests = {};
Object.keys(requestsMap).forEach((type) => {
    wrappedRequests[type] = wrapRequest(type);
})
console.log(wrappedRequests);

export default wrappedRequests;
