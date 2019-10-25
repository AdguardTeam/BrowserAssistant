import browser from 'webextension-polyfill';

const port = browser.runtime.connectNative('native_browser_assistant');

port.onMessage.addListener((response) => {
    const {
        id, data, parameters, appState, result, requestId,
    } = response;
    console.log(`ResponseId = ${id} - Received: id = ${requestId}, parameters = ${JSON.stringify(parameters)}, appState = ${JSON.stringify(appState)}, result = ${result}, data = ${data || 'no additional data received'}`);
    browser.runtime.sendMessage(response);
});

const RequestTypes = {
    init: 'init',
    getCurrentAppState: 'getCurrentAppState',
    getCurrentFilteringState: 'getCurrentFilteringState',
    setProtectionStatus: 'setProtectionStatus',
    setFilteringStatus: 'setFilteringStatus',
    addRule: 'addRule',
    removeRule: 'removeRule',
    removeCustomRules: 'removeCustomRules',
    openOriginCert: 'openOriginCert',
    reportSite: 'reportSite',
    openFilteringLog: 'openFilteringLog',
    openSettings: 'openSettings',
};

const AssistantTypes = {
    nativeAssistant: 'nativeAssistant',
    assistant: 'assistant',
};

const init = ({ version, apiVersion, userAgent },
    assistantType = AssistantTypes.nativeAssistant) => ({
    type: RequestTypes.init,
    parameters: {
        version,
        apiVersion,
        userAgent,
        type: assistantType,
    },
});

const getCurrentAppState = () => ({
    type: RequestTypes.getCurrentAppState,
});

const getCurrentFilteringState = url => ({
    type: RequestTypes.getCurrentFilteringState,
    parameters: {
        url,
    },
});

const setProtectionStatus = isEnabled => ({
    type: RequestTypes.setProtectionStatus,
    parameters: {
        isEnabled,
    },
});

const setFilteringStatus = ({ isEnabled, isHttpsEnabled, url }) => ({
    type: RequestTypes.setFilteringStatus,
    parameters: { isEnabled, isHttpsEnabled, url },
});

const addRule = ruleText => ({
    type: RequestTypes.addRule,
    parameters: { ruleText },
});

const removeRule = ruleText => ({
    type: RequestTypes.removeRule,
    parameters: { ruleText },
});

const removeCustomRules = url => ({
    type: RequestTypes.removeCustomRules,
    parameters: { url },
});

const openOriginCert = domain => ({
    type: RequestTypes.openOriginCert,
    parameters: { domain },
});


const reportSite = ({ url, referrer, userAgent }) => ({
    type: RequestTypes.reportSite,
    parameters: { url, referrer, userAgent },
});

const openFilteringLog = () => ({
    type: RequestTypes.openFilteringLog,
});

const openSettings = () => ({
    type: RequestTypes.openSettings,
});

const requestsMap = {
    init,
    getCurrentAppState,
    getCurrentFilteringState,
    setProtectionStatus,
    setFilteringStatus,
    addRule,
    removeRule,
    removeCustomRules,
    openOriginCert,
    reportSite,
    openFilteringLog,
    openSettings,
};

const testReqParams = {
    init: {
        version: '1.2.3.5',
        apiVersion: '3',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
        type: 'nativeAssistant',
    },
    getCurrentAppState: null,
    getCurrentFilteringState: 'https://yandex.ru',
    setProtectionStatus: true,
    setFilteringStatus: {
        isEnabled: true,
        isHttpsEnabled: true,
        url: 'https://yandex.ru',
    },
    addRule: '||yandex.ru^',
    removeRule: '||yandex.ru^',
    removeCustomRules: 'https://yandex.ru',
    openOriginCert: 'yandex.ru',
    reportSite: {
        url: 'https://habr.com',
        referrer: 'https://yandex.ru',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36',
    },
    openFilteringLog: null,
    openSettings: null,
};

const generateRandomId = () => Math.floor(Math.random() * 1000);

const wrapper = (requestName) => {
    const requestFunction = requestsMap[requestName];
    const requestParams = testReqParams[requestName];
    const request = requestFunction(requestParams);
    request.id = generateRandomId();
    console.log('request ', request);
    return port.postMessage(request);
};

class Request {
    init() { wrapper('init'); }

    getCurrentAppState() { wrapper('getCurrentAppState'); }

    getCurrentFilteringState() { wrapper('getCurrentFilteringState'); }

    setProtectionStatus() { wrapper('setProtectionStatus'); }

    setFilteringStatus() { wrapper('setFilteringStatus'); }

    addRule() { wrapper('addRule'); }

    removeRule() { wrapper('removeRule'); }

    removeCustomRules() { wrapper('removeCustomRules'); }

    openOriginCert() { wrapper('openOriginCert'); }

    reportSite() { wrapper('reportSite'); }

    openFilteringLog() { wrapper('openFilteringLog'); }

    openSettings() { wrapper('openSettings'); }
}

const request = new Request();

global.adguard = {
    request,
};
