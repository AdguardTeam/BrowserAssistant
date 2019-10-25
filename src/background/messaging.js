
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

export const requestsMap = {
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

export const testReqParams = {
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
