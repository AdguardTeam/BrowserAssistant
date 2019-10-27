import { RequestTypes, AssistantTypes } from './types';

const version = '1.2.3.5';
const apiVersion = '3';
const { userAgent } = window.navigator;

const init = (assistantType = AssistantTypes.nativeAssistant) => ({
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

const addRule = hostname => ({
    type: RequestTypes.addRule,
    parameters: { ruleText: `||${hostname}^` },
});

const removeRule = hostname => ({
    type: RequestTypes.removeRule,
    parameters: { ruleText: `||${hostname}^` },
});

const removeCustomRules = url => ({
    type: RequestTypes.removeCustomRules,
    parameters: { url },
});


const openOriginCert = domain => ({
    type: RequestTypes.openOriginCert,
    parameters: { domain },
});

const reportSite = ({ url, referrer }) => ({
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
