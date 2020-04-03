import { POPUP_MESSAGES, CONTENT_MESSAGES } from '../lib/types';
import tabs from './tabs';
import state from './state';

const messageHandler = async (msg) => {
    const { type, data } = msg;

    switch (type) {
        case POPUP_MESSAGES.GET_POPUP_DATA: {
            const { tab } = data;
            const referrer = await tabs.getReferrer(tab);
            let currentFilteringState;
            try {
                currentFilteringState = await state.getCurrentFilteringState(tab);
            } catch (e) {
                const updateStatusInfo = await state.getUpdateStatusInfo();
                const appState = await state.getAppState();
                return {
                    referrer,
                    updateStatusInfo,
                    appState,
                    hostError: e.message,
                };
            }
            const updateStatusInfo = await state.getUpdateStatusInfo();
            const appState = await state.getAppState();
            return {
                referrer,
                updateStatusInfo,
                appState,
                currentFilteringState,
            };
        }

        case POPUP_MESSAGES.GET_CURRENT_FILTERING_STATE: {
            const { url } = data;
            return state.getCurrentFilteringState(url);
        }

        case POPUP_MESSAGES.SET_PROTECTION_STATUS: {
            const { isEnabled } = data;
            const resultAppState = await state.setProtectionStatus(isEnabled);
            return Promise.resolve(resultAppState);
        }

        case POPUP_MESSAGES.SET_FILTERING_STATUS: {
            const { isEnabled, isHttpsEnabled, url } = data;
            await state.setFilteringStatus(
                isEnabled,
                isHttpsEnabled,
                url
            );
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

        case POPUP_MESSAGES.OPEN_PAGE: {
            const { url } = data;
            await tabs.openPage(url);
            break;
        }

        case POPUP_MESSAGES.RELOAD: {
            const { tab } = data;
            await tabs.reload(tab);
            break;
        }

        case POPUP_MESSAGES.INIT_ASSISTANT: {
            const { tabId } = data;
            await tabs.initAssistant(tabId);
            break;
        }

        case CONTENT_MESSAGES.ADD_RULE: {
            const { ruleText } = data;
            await state.addRule(ruleText);
            break;
        }

        default: {
            throw new Error(`Unknown message type was sent: ${type}`);
        }
    }

    return Promise.resolve();
};

export default messageHandler;
