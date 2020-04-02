import { POPUP_MESSAGES } from '../types';
import browserApi from '../browserApi';

const sendMessage = async (type, data) => browserApi.runtime.sendMessage({ type, data });

export default {
    getPopupData: (tab) => {
        return sendMessage(POPUP_MESSAGES.GET_POPUP_DATA, { tab });
    },
    getUrlFilteringState: (url) => {
        return sendMessage(POPUP_MESSAGES.GET_CURRENT_FILTERING_STATE, { url });
    },
    initAssistant: (tabId) => {
        return sendMessage(POPUP_MESSAGES.INIT_ASSISTANT, { tabId });
    },
    setProtectionStatus: (isEnabled) => {
        return sendMessage(POPUP_MESSAGES.SET_PROTECTION_STATUS, { isEnabled });
    },
    reportSite: (url, referrer) => {
        return sendMessage(POPUP_MESSAGES.REPORT_SITE, { url, referrer });
    },
    reload: (tab) => {
        return sendMessage(POPUP_MESSAGES.RELOAD, { tab });
    },
    removeCustomRules: (url) => {
        return sendMessage(POPUP_MESSAGES.REMOVE_CUSTOM_RULES, { url });
    },
    openFilteringLog: () => {
        return sendMessage(POPUP_MESSAGES.OPEN_FILTERING_LOG);
    },
    openSettings: () => {
        return sendMessage(POPUP_MESSAGES.OPEN_SETTINGS);
    },
    setFilteringStatus: (url, isEnabled, isHttpsEnabled) => {
        return sendMessage(POPUP_MESSAGES.SET_FILTERING_STATUS, { url, isEnabled, isHttpsEnabled });
    },
    openOriginalCert: (domain, port) => {
        return sendMessage(POPUP_MESSAGES.OPEN_ORIGINAL_CERT, { domain, port });
    },
    updateApp: () => {
        return sendMessage(POPUP_MESSAGES.UPDATE_APP);
    },
    openPage: (url) => {
        return sendMessage(POPUP_MESSAGES.OPEN_PAGE, { url });
    },
};
