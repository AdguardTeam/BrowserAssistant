import { POPUP_MESSAGES, CONTENT_MESSAGES } from '../../lib/types';
import nativeHostApi from '../NativeHostApi';
import tabs from '../tabs';
import state from '../state';
import { SWITCHER_TRANSITION_TIME } from '../../popup/stores/consts';

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
            const responseParams = await nativeHostApi.setFilteringStatus(
                isEnabled,
                isHttpsEnabled,
                url
            );

            setTimeout(() => {
                // TODO figure out method necessity
                // state.setIsFilteringEnabled(data.isEnabled);
            }, SWITCHER_TRANSITION_TIME);

            return Promise.resolve(responseParams);
        }

        case POPUP_MESSAGES.REMOVE_CUSTOM_RULES: {
            const { url } = data;
            const responseParams = await nativeHostApi.removeCustomRules(url);
            return Promise.resolve(responseParams);
        }

        case POPUP_MESSAGES.OPEN_ORIGINAL_CERT: {
            const { domain, port } = data;
            const responseParams = await nativeHostApi.openOriginalCert(domain, port);
            return Promise.resolve(responseParams);
        }

        case POPUP_MESSAGES.REPORT_SITE: {
            const { url, referrer } = data;
            const response = await nativeHostApi.reportSite(url, referrer);
            await tabs.openPage(response.parameters.reportUrl);
            return Promise.resolve(response);
        }

        case POPUP_MESSAGES.OPEN_FILTERING_LOG: {
            const responseParams = await nativeHostApi.openFilteringLog();
            return Promise.resolve(responseParams);
        }

        case POPUP_MESSAGES.OPEN_SETTINGS: {
            const responseParams = await nativeHostApi.openSettings();
            return Promise.resolve(responseParams);
        }

        case POPUP_MESSAGES.UPDATE_APP: {
            const responseParams = await nativeHostApi.updateApp();
            return Promise.resolve(responseParams);
        }

        case POPUP_MESSAGES.OPEN_PAGE: {
            const { url } = data;
            const responseParams = await tabs.openPage(url);
            return Promise.resolve(responseParams);
        }

        case POPUP_MESSAGES.RELOAD: {
            const { tab } = data;
            const responseParams = await tabs.reload(tab);
            return Promise.resolve(responseParams);
        }

        case POPUP_MESSAGES.INIT_ASSISTANT: {
            const { tabId } = data;
            const responseParams = await tabs.initAssistant(tabId);
            return Promise.resolve(responseParams);
        }

        // TODO check if there is possibility to block website fully from legacy assistant
        case CONTENT_MESSAGES.ADD_RULE: {
            const { ruleText } = data;
            const responseParams = await nativeHostApi.addRule(ruleText);
            return Promise.resolve(responseParams);
        }

        default: {
            throw new Error(`Unknown message type was sent: ${type}`);
        }
    }
};

export default messageHandler;
