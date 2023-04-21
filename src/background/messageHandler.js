import browser from 'webextension-polyfill';

import {
    POPUP_MESSAGES,
    CONTENT_MESSAGES,
    POST_INSTALL_MESSAGES,
    OPTIONS_UI_MESSAGES,
} from '../lib/types';
import { tabs } from '../lib/tabs';
import { tabsService } from './TabsService';
import state from './state';
import getPopupData from './getPopupData';
import filteringPause from './filteringPause';
import { consent } from './consent';
import { settings } from './settings';

/**
 * Handles incoming messages to the background page
 * @param message
 * @param {string} message.type
 * @param {*} message.data
 * @returns {Promise<*>}
 */
// eslint-disable-next-line consistent-return
export const messageHandler = async (message) => {
    const { type, data } = message;

    switch (type) {
        // Message used to keep service worker awake
        case CONTENT_MESSAGES.PING: {
            break;
        }

        case POPUP_MESSAGES.GET_APP_LOCALE: {
            return state.getLocale();
        }

        case POPUP_MESSAGES.GET_POPUP_DATA: {
            const { tab } = data;
            const popupData = await getPopupData(tab);
            return popupData;
        }

        case POPUP_MESSAGES.GET_CURRENT_FILTERING_STATE: {
            const { tab, forceStart } = data;
            return state.getCurrentFilteringState(tab, forceStart);
        }

        case POPUP_MESSAGES.GET_APP_STATE: {
            return {
                appState: state.getAppState(),
                updateStatusInfo: state.getUpdateStatusInfo(),
            };
        }

        case POPUP_MESSAGES.SET_PROTECTION_STATUS: {
            const { isEnabled } = data;
            const resultAppState = await state.setProtectionStatus(isEnabled);

            filteringPause.resetAllHostnameTimeout();
            await filteringPause.notifyPopup();

            return resultAppState;
        }

        case POPUP_MESSAGES.SET_FILTERING_STATUS: {
            const { isEnabled, isHttpsEnabled, url } = data;
            await state.setFilteringStatus(
                isEnabled,
                isHttpsEnabled,
                url,
            );

            await filteringPause.clearHostnameTimeout(url);
            break;
        }

        case POPUP_MESSAGES.REMOVE_CUSTOM_RULES: {
            const { url } = data;
            await state.removeCustomRules(url);
            break;
        }

        case POPUP_MESSAGES.OPEN_ORIGINAL_CERT: {
            const { domain, port } = data;
            await state.openOriginalCert(domain, port);
            break;
        }

        case POPUP_MESSAGES.REPORT_SITE: {
            const { url, referrer } = data;
            const reportUrl = await state.reportSite(url, referrer);
            await tabs.openPage(reportUrl);
            break;
        }

        case POPUP_MESSAGES.OPEN_FILTERING_LOG: {
            await state.openFilteringLog();
            break;
        }

        case POPUP_MESSAGES.OPEN_SETTINGS: {
            await state.openSettings();
            break;
        }

        case POPUP_MESSAGES.UPDATE_APP: {
            await state.updateApp();
            break;
        }

        case POPUP_MESSAGES.INIT_ASSISTANT: {
            const { tabId } = data;
            await tabsService.initAssistant(tabId);
            break;
        }

        case CONTENT_MESSAGES.ADD_RULE: {
            const { ruleText } = data;
            await state.addRule(ruleText);
            break;
        }

        case POPUP_MESSAGES.PAUSE_FILTERING: {
            const { tab } = data;
            await filteringPause.handleFilteringPause(tab.url);
            await tabs.reloadTab(tab);
            break;
        }

        case POST_INSTALL_MESSAGES.UNINSTALL_EXTENSION: {
            browser.management.uninstallSelf();
            break;
        }

        case POST_INSTALL_MESSAGES.AGREE_WITH_CONDITIONS: {
            await consent.setConsentRequired(false);
            await tabs.closePostInstall();
            break;
        }

        case POPUP_MESSAGES.GET_CONSENT_REQUIRED: {
            return consent.isConsentRequired();
        }

        case OPTIONS_UI_MESSAGES.GET_SETTING: {
            return settings.getSetting(data.key);
        }

        case OPTIONS_UI_MESSAGES.SET_SETTING: {
            return settings.setSetting(data.key, data.value);
        }

        default: {
            throw new Error(`Unknown message type was sent: ${type}`);
        }
    }
};
