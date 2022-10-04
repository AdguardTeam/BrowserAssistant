import browser from 'webextension-polyfill';
import { nanoid } from 'nanoid';

import { POPUP_MESSAGES, BACKGROUND_MESSAGES, FEEDBACK_ACTIONS } from '../lib/types';
import { browserApi } from '../lib/browserApi';

const sendMessage = async (type, data) => {
    return browserApi.runtime.sendMessage({ type, data });
};

export const messagesSender = {
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
    pauseFiltering: (tab) => {
        return sendMessage(POPUP_MESSAGES.PAUSE_FILTERING, { tab });
    },
    getConsentRequired: () => {
        return sendMessage(POPUP_MESSAGES.GET_CONSENT_REQUIRED);
    },
};

/**
 * Creates long lived connection between popup and background page
 */
export const createLongLivedConnection = (rootStore) => {
    const { settingsStore } = rootStore;

    const popupId = `popup_${nanoid(7)}`;

    const messageHandler = async (message) => {
        switch (message.type) {
            case BACKGROUND_MESSAGES.CLOSE_POPUP: {
                if (message.popupId === popupId) {
                    window.close();
                }
                break;
            }
            case POPUP_MESSAGES.STATE_UPDATED: {
                // TODO move back feedbackAction check for updatePopupData
                //  when windows and mac apps will release new feedbackActions
                await settingsStore.updatePopupData();

                const { appState, updateStatusInfo } = message.data;
                if (appState.feedbackAction === FEEDBACK_ACTIONS.UPDATE_APPLICATION_APP_ONLY) {
                    settingsStore.setCurrentAppState(appState);
                    settingsStore.setUpdateStatusInfo(updateStatusInfo);
                }
                break;
            }
            case POPUP_MESSAGES.UPDATE_FILTERING_PAUSE_TIMEOUT: {
                const { currentTabHostname } = settingsStore;
                const filteringPauseTimeout = message.data.filteringPauseMap[currentTabHostname];

                if (filteringPauseTimeout === undefined) {
                    break;
                }

                if (filteringPauseTimeout >= 0) {
                    await settingsStore.setFilteringPauseTimeout(filteringPauseTimeout);
                } else {
                    await settingsStore.updatePopupData();
                }
                break;
            }
            default:
                break;
        }
    };

    const port = browser.runtime.connect({ name: popupId });
    port.onMessage.addListener(messageHandler);

    const onUnload = () => {
        port.onMessage.removeListener(messageHandler);
        port.disconnect();
    };

    return onUnload;
};
