import browser from 'webextension-polyfill';
import requests from './requestsApi';
import api from './Api';
import { MESSAGE_TYPES } from '../lib/types';
import tabs from './tabs';
import log from '../lib/logger';
import icon from './icon';

const handleMessage = async (msg) => {
    const { type, params } = msg;
    let responseParams;

    switch (type) {
        case MESSAGE_TYPES.getCurrentFilteringState: {
            responseParams = await requests.getCurrentFilteringState(params);
            await icon.updateIconColor(responseParams.parameters.isFilteringEnabled);
            break;
        }

        case MESSAGE_TYPES.setProtectionStatus: {
            responseParams = await requests.setProtectionStatus(params);
            await icon.updateIconColor(responseParams.appState.isProtectionEnabled);
            break;
        }

        case MESSAGE_TYPES.setFilteringStatus: {
            responseParams = await requests.setFilteringStatus(params);
            break;
        }

        case MESSAGE_TYPES.addRule: {
            responseParams = await requests.addRule(params);
            break;
        }

        case MESSAGE_TYPES.removeRule: {
            responseParams = await requests.removeRule(params);
            break;
        }

        case MESSAGE_TYPES.removeCustomRules: {
            responseParams = await requests.removeCustomRules(params);
            break;
        }

        case MESSAGE_TYPES.openOriginalCert: {
            responseParams = await requests.openOriginalCert(params);
            break;
        }

        case MESSAGE_TYPES.reportSite: {
            responseParams = await requests.reportSite(params);
            await tabs.openPage(responseParams.parameters.reportUrl);
            break;
        }

        case MESSAGE_TYPES.openFilteringLog: {
            responseParams = await requests.openFilteringLog(params);
            break;
        }

        case MESSAGE_TYPES.openSettings: {
            responseParams = await requests.openSettings(params);
            break;
        }

        case MESSAGE_TYPES.updateApp: {
            responseParams = await requests.updateApp(params);
            break;
        }

        case MESSAGE_TYPES.openPage: {
            responseParams = await tabs.openPage(params);
            break;
        }

        case MESSAGE_TYPES.reload: {
            responseParams = await tabs.reload(params);
            break;
        }

        case MESSAGE_TYPES.getReferrer: {
            responseParams = await tabs.getReferrer(params);
            break;
        }

        case MESSAGE_TYPES.updateIconColor: {
            responseParams = await icon.updateIconColor(params);
            break;
        }

        case MESSAGE_TYPES.getCurrentTabUrlProperties: {
            responseParams = await tabs.getCurrentTabUrlProperties(params);
            break;
        }

        case MESSAGE_TYPES.initAssistant: {
            responseParams = await tabs.initAssistant(params);
            break;
        }

        case MESSAGE_TYPES.getUpdateStatusInfo: {
            responseParams = {
                isAppUpToDate: api.isAppUpToDate,
                isExtensionUpdated: api.isExtensionUpdated,
                isSetupCorrect: tabs.isSetupCorrect,
            };
            break;
        }

        default: {
            log.warn('Inner messaging type "%s" is not in the message handlers', type);
            return;
        }
    }

    // eslint-disable-next-line consistent-return
    return Promise.resolve({
        type,
        params: responseParams,
    });
};

try {
    api.init();

    browser.runtime.onMessage.addListener(handleMessage);
    browser.tabs.onActivated.addListener(icon.updateIconColorListener);
    browser.tabs.onUpdated.addListener(icon.updateIconColorReloadListener);
} catch (error) {
    log.error(error);
}
