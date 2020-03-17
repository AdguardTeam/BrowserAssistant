import { MESSAGE_TYPES } from '../../lib/types';
import requests from '../requestsApi';
import icon from '../Icon';
import tabs from '../Tabs';
import log from '../../lib/logger';
import state from '../State';

const messageHandler = async (msg) => {
    const { type, params } = msg;

    switch (type) {
        case MESSAGE_TYPES.getCurrentFilteringState: {
            const responseParams = await requests.getCurrentFilteringState(params);
            state.setIsFilteringEnabled(responseParams.parameters.isFilteringEnabled);
            await icon.updateIconColor();
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.setProtectionStatus: {
            const responseParams = await requests.setProtectionStatus(params);
            state.setIsProtectionEnabled(responseParams.appState.isProtectionEnabled);
            await icon.updateIconColor();
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.setFilteringStatus: {
            const responseParams = await requests.setFilteringStatus(params);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.addRule: {
            const responseParams = await requests.addRule(params);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.removeRule: {
            const responseParams = await requests.removeRule(params);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.removeCustomRules: {
            const responseParams = await requests.removeCustomRules(params);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.openOriginalCert: {
            const responseParams = await requests.openOriginalCert(params);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.reportSite: {
            const responseParams = await requests.reportSite(params);
            await tabs.openPage(responseParams.parameters.reportUrl);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.openFilteringLog: {
            const responseParams = await requests.openFilteringLog(params);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.openSettings: {
            const responseParams = await requests.openSettings(params);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.updateApp: {
            const responseParams = await requests.updateApp(params);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.openPage: {
            const responseParams = await tabs.openPage(params);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.reload: {
            const responseParams = await tabs.reload(params);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.getReferrer: {
            const responseParams = await tabs.getReferrer(params);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.updateIconColor: {
            const responseParams = await icon.updateIconColor(params);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.getCurrentTabUrlProperties: {
            const responseParams = await tabs.getCurrentTabUrlProperties(params);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.initAssistant: {
            const responseParams = await tabs.initAssistant(params);
            return Promise.resolve(responseParams);
        }

        case MESSAGE_TYPES.getUpdateStatusInfo: {
            const responseParams = {
                locale: state.locale,
                isAppUpToDate: state.isAppUpToDate,
                isExtensionUpdated: state.isExtensionUpdated,
                isSetupCorrect: state.isSetupCorrect,
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
