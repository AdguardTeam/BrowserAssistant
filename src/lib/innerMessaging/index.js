import { MESSAGE_TYPES as MSG, MESSAGE_TYPES } from '../types';
import browserApi from '../browserApi';

const sendMessage = async (type, data) => browserApi.runtime.sendMessage({ type, data });

export default {
    getReferrer: (tab) => { // TODO consider using only id
        return sendMessage(MESSAGE_TYPES.getReferrer, { tab }); // TODO use uppercase
    },
    getUrlFilteringState: (url, forceStart) => {
        return sendMessage(MESSAGE_TYPES.getCurrentFilteringState, { url, forceStart });
    },
    getUpdateStatusInfo: () => {
        return sendMessage(MESSAGE_TYPES.getUpdateStatusInfo);
    },
    getPopupData: (tab) => {
        return sendMessage(MESSAGE_TYPES.GET_POPUP_DATA, { tab });
    },
    initAssistant: (tabId) => {
        // TODO rename message type uppercase
        return sendMessage(MESSAGE_TYPES.initAssistant, { tabId });
    },
    setProtectionStatus: (isEnabled) => {
        // TODO rename message types uppercase
        return sendMessage(MESSAGE_TYPES.setProtectionStatus, { isEnabled });
    },
    // TODO rename MSG to message types
    // [MSG.getCurrentAppState]: () => sendMessage(MSG.getCurrentAppState),
    // [MSG.getCurrentFilteringState]: (data) => sendMessage(MSG.getCurrentFilteringState, data),
    // [MSG.setProtectionStatus]: (data) => sendMessage(MSG.setProtectionStatus, data),
    [MSG.setFilteringStatus]: (data) => sendMessage(MSG.setFilteringStatus, data),
    [MSG.addRule]: (data) => sendMessage(MSG.addRule, data),
    [MSG.removeRule]: (data) => sendMessage(MSG.removeRule, data),
    [MSG.removeCustomRules]: (data) => sendMessage(MSG.removeCustomRules, data),
    [MSG.openOriginalCert]: (data) => sendMessage(MSG.openOriginalCert, data),
    [MSG.reportSite]: (data) => sendMessage(MSG.reportSite, data),
    [MSG.openFilteringLog]: () => sendMessage(MSG.openFilteringLog),
    [MSG.openSettings]: () => sendMessage(MSG.openSettings),
    [MSG.updateApp]: () => sendMessage(MSG.updateApp),
    [MSG.openPage]: (data) => sendMessage(MSG.openPage, data),
    [MSG.reload]: () => sendMessage(MSG.reload),
    [MSG.getReferrer]: () => sendMessage(MSG.getReferrer),
};
