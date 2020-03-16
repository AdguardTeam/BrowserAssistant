import { MESSAGE_TYPES as MSG } from '../types';
import browserApi from '../browserApi';

const sendMessage = (type, params) => browserApi.runtime.sendMessage({ type, params });

export default {
    [MSG.getCurrentAppState]: () => sendMessage(MSG.getCurrentAppState),
    [MSG.getCurrentFilteringState]: (params) => sendMessage(MSG.getCurrentFilteringState, params),
    [MSG.setProtectionStatus]: (params) => sendMessage(MSG.setProtectionStatus, params),
    [MSG.setFilteringStatus]: (params) => sendMessage(MSG.setFilteringStatus, params),
    [MSG.addRule]: (params) => sendMessage(MSG.addRule, params),
    [MSG.removeRule]: (params) => sendMessage(MSG.removeRule, params),
    [MSG.removeCustomRules]: (params) => sendMessage(MSG.removeCustomRules, params),
    [MSG.openOriginalCert]: (params) => sendMessage(MSG.openOriginalCert, params),
    [MSG.reportSite]: (params) => sendMessage(MSG.reportSite, params),
    [MSG.openFilteringLog]: () => sendMessage(MSG.openFilteringLog),
    [MSG.openSettings]: () => sendMessage(MSG.openSettings),
    [MSG.updateApp]: () => sendMessage(MSG.updateApp),
    [MSG.openPage]: (params) => sendMessage(MSG.openPage, params),
    [MSG.reload]: () => sendMessage(MSG.reload),
    [MSG.getReferrer]: () => sendMessage(MSG.getReferrer),
    [MSG.updateIconColor]: (params) => sendMessage(MSG.updateIconColor, params),
    [MSG.getCurrentTabUrlProperties]: (params) => {
        return sendMessage(MSG.getCurrentTabUrlProperties, params);
    },
    [MSG.initAssistant]: () => sendMessage(MSG.initAssistant),
    [MSG.getUpdateStatusInfo]: () => sendMessage(MSG.getUpdateStatusInfo),
};
