import nanoid from 'nanoid';
import browser from 'webextension-polyfill';
import { requestsMap, testReqParams } from './messaging';

const port = browser.runtime.connectNative('native_browser_assistant');

port.onMessage.addListener((response) => {
    const {
        id, data, parameters, appState, result, requestId,
    } = response;
    console.log(`ResponseId = ${id} - Received: id = ${requestId}, parameters = ${JSON.stringify(parameters)}, appState = ${JSON.stringify(appState)}, result = ${result}, data = ${data || 'no additional data received'}`);
    browser.runtime.sendMessage(response);
});


const wrap = (requestName) => {
    const requestFunction = requestsMap[requestName];
    const requestParams = testReqParams[requestName];
    const request = requestFunction(requestParams);
    request.id = nanoid();
    console.log('request ', request);
    return () => port.postMessage(request);
};

export default {
    init: wrap('init'),

    getCurrentAppState: wrap('getCurrentAppState'),

    getCurrentFilteringState: wrap('getCurrentFilteringState'),

    setProtectionStatus: wrap('setProtectionStatus'),

    setFilteringStatus: wrap('setFilteringStatus'),

    addRule: wrap('addRule'),

    removeRule: wrap('removeRule'),

    removeCustomRules: wrap('removeCustomRules'),

    openOriginCert: wrap('openOriginCert'),

    reportSite: wrap('reportSite'),

    openFilteringLog: wrap('openFilteringLog'),

    openSettings: wrap('openSettings'),
};
