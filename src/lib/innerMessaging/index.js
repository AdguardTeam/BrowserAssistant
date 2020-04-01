import { MESSAGE_TYPES } from '../types';
import browserApi from '../browserApi';

const sendMessage = async (type, data) => browserApi.runtime.sendMessage({ type, data });

export default {
    getPopupData: (tab) => {
        return sendMessage(MESSAGE_TYPES.GET_POPUP_DATA, { tab });
    },
    getReferrer: (tab) => { // TODO consider using only id
        return sendMessage(MESSAGE_TYPES.getReferrer, { tab }); // TODO use uppercase
    },
    getUrlFilteringState: (url, forceStart) => {
        return sendMessage(MESSAGE_TYPES.getCurrentFilteringState, { url, forceStart });
    },
    getUpdateStatusInfo: () => {
        return sendMessage(MESSAGE_TYPES.getUpdateStatusInfo);
    },
    initAssistant: (tabId) => {
        // TODO rename message type uppercase
        return sendMessage(MESSAGE_TYPES.initAssistant, { tabId });
    },
    setProtectionStatus: (isEnabled) => {
        // TODO rename message types uppercase
        return sendMessage(MESSAGE_TYPES.setProtectionStatus, { isEnabled });
    },
    reportSite: (url, referrer) => {
        return sendMessage(MESSAGE_TYPES.reportSite, { url, referrer });
    },
    reload: (tab) => {
        return sendMessage(MESSAGE_TYPES.reload, { tab });
    },
    removeCustomRules: (url) => {
        return sendMessage(MESSAGE_TYPES.removeCustomRules, { url });
    },
    openFilteringLog: () => {
        return sendMessage(MESSAGE_TYPES.openFilteringLog);
    },
    openSettings: () => {
        return sendMessage(MESSAGE_TYPES.openSettings);
    },
    // eslint-disable-next-line max-len
    [MESSAGE_TYPES.setFilteringStatus]: (data) => sendMessage(MESSAGE_TYPES.setFilteringStatus, data),
    [MESSAGE_TYPES.openOriginalCert]: (data) => sendMessage(MESSAGE_TYPES.openOriginalCert, data),
    [MESSAGE_TYPES.updateApp]: () => sendMessage(MESSAGE_TYPES.updateApp),
    [MESSAGE_TYPES.openPage]: (data) => sendMessage(MESSAGE_TYPES.openPage, data),
    [MESSAGE_TYPES.getReferrer]: () => sendMessage(MESSAGE_TYPES.getReferrer),
};
