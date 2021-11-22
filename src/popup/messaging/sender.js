import { POPUP_MESSAGES } from '../../lib/types';
import browserApi from '../../lib/browserApi';

const sendMessage = async (type, data) => browserApi.runtime.sendMessage({ type, data });

export default {
    getLocale: () => {
        return sendMessage(POPUP_MESSAGES.GET_APP_LOCALE);
    },
    getPopupData: (tab) => {
        return sendMessage(POPUP_MESSAGES.GET_POPUP_DATA, { tab });
    },
    getUrlFilteringState: (tab, forceStart = false) => {
        return sendMessage(POPUP_MESSAGES.GET_CURRENT_FILTERING_STATE, { tab, forceStart });
    },
    getAppState: () => {
        return sendMessage(POPUP_MESSAGES.GET_APP_STATE);
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
    pauseFiltering: (tab) => {
        return sendMessage(POPUP_MESSAGES.PAUSE_FILTERING, { tab });
    },
    contactSupport: () => {
        return sendMessage(POPUP_MESSAGES.CONTACT_SUPPORT);
    },
    getConsent: () => {
        return sendMessage(POPUP_MESSAGES.CONSENT_RECEIVED);
    },
};
