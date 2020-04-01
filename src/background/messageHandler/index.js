import { MESSAGE_TYPES } from '../../lib/types';
import nativeHostApi from '../NativeHostApi';
import tabs from '../tabs';
import log from '../../lib/logger';
import state from '../State';
import { SWITCHER_TRANSITION_TIME } from '../../popup/stores/consts';

const messageHandler = async (msg) => {
    const { type, data } = msg;

    switch (type) {
        case MESSAGE_TYPES.GET_POPUP_DATA: {
            const { tab } = data;
            const referrer = await tabs.getReferrer(tab);
            const currentFilteringState = await state.getCurrentFilteringState(tab);
            const updateStatusInfo = await state.getUpdateStatusInfo();
            const appState = await state.getAppState();

            return {
                referrer,
                currentFilteringState,
                updateStatusInfo,
                appState,
            };
        }

        case MESSAGE_TYPES.getCurrentFilteringState: {
            const { url } = data;
            return state.getCurrentFilteringState(url);
        }

        case MESSAGE_TYPES.setProtectionStatus: {
            const { isEnabled } = data;
            const resultAppState = await state.setProtectionStatus(isEnabled);
            return Promise.resolve(resultAppState);
        }

        case MESSAGE_TYPES.setFilteringStatus: {
            const responseParams = await nativeHostApi.setFilteringStatus(data);

            setTimeout(() => {
                state.setIsFilteringEnabled(data.isEnabled);
            }, SWITCHER_TRANSITION_TIME);

            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.addRule: {
            const responseParams = await nativeHostApi.addRule(data);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.removeRule: {
            const responseParams = await nativeHostApi.removeRule(data);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.removeCustomRules: {
            const responseParams = await nativeHostApi.removeCustomRules(data);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.openOriginalCert: {
            const responseParams = await nativeHostApi.openOriginalCert(data);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.reportSite: {
            const responseParams = await nativeHostApi.reportSite(data);
            await tabs.openPage(responseParams.parameters.reportUrl);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.openFilteringLog: {
            const responseParams = await nativeHostApi.openFilteringLog();
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.openSettings: {
            const responseParams = await nativeHostApi.openSettings();
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.updateApp: {
            const responseParams = await nativeHostApi.updateApp();
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.openPage: {
            const responseParams = await tabs.openPage(data);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.reload: {
            const responseParams = await tabs.reload(data);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.getReferrer: {
            const responseParams = await tabs.getReferrer(data);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.initAssistant: {
            const { tabId } = data;
            const responseParams = await tabs.initAssistant(tabId);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.getUpdateStatusInfo: {
            const responseParams = {
                locale: state.locale,
                isAppUpToDate: state.isAppUpToDate,
                isValidatedOnHost: state.isValidatedOnHost,
            };
            return Promise.resolve(responseParams);
        }
        default: {
            log.warn('Inner messaging type "%s" is not in the message handlers', type);
            return Promise.resolve(null);
        }
    }
};

export default messageHandler;
