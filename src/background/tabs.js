import browser from 'webextension-polyfill';
import { BACKGROUND_COMMANDS, MessageTypes, RequestTypes } from '../lib/types';
import log from '../lib/logger';
import browserApi from './browserApi';
import { DOWNLOAD_LINK, CONTENT_SCRIPT_NAME } from '../lib/conts';
import requests from './requestsApi';
import actions from './actions';
import { getFormattedPortByProtocol, getProtocol, getUrlProperties } from '../lib/helpers';

class Tabs {
    isSetupCorrectly = true;

    getCurrent = async () => {
        let tab;

        try {
            [tab] = await browser.tabs.query({
                active: true,
                lastFocusedWindow: true,
            });

            if (!tab) {
                log.warn('browser.tabs.query is called from a non-tab context (a background page or popup view)');
                return tab;
            }

            if (!(Object.prototype.hasOwnProperty.call(tab, 'url'))) {
                log.error('Browser tabs api error: no url property in the current tab. Checkout tabs permission in the manifest', tab);

                this.isSetupCorrectly = false;
                await browserApi.runtime
                    .sendMessage({ result: BACKGROUND_COMMANDS.SHOW_SETUP_INCORRECTLY });
            }
        } catch (error) {
            log.error(error);
        }
        return tab;
    };

    sendMessage = async (type, options) => {
        const tab = await this.getCurrent();
        let response;
        try {
            response = await browser.tabs.sendMessage(tab.id, {
                type,
                options,
            });
        } catch (error) {
            if (!browser.runtime.lastError) {
                log.error(error);
            }
        }
        return response;
    };

    getReferrer = async () => {
        return this.sendMessage(MessageTypes.getReferrer);
    };

    initAssistant = async () => {
        const tab = await this.getCurrent();
        await browser.tabs.executeScript(tab.id, { file: CONTENT_SCRIPT_NAME });
        const options = { addRuleCallbackName: RequestTypes.addRule };
        this.sendMessage(MessageTypes.initAssistant, options);
    };

    openPage = (url = DOWNLOAD_LINK) => {
        browser.tabs.create({ url });
    };

    getCurrentTabUrlProperties = async () => {
        const tab = await this.getCurrent();
        const url = tab.url || tab.pendingUrl;

        const { hostname, port, protocol } = getUrlProperties(url);

        const currentProtocol = getProtocol(protocol);
        const currentPort = getFormattedPortByProtocol(port, currentProtocol);

        return {
            currentURL: url,
            currentPort,
            currentProtocol,
            hostname,
        };
    };

    getAppWorkingStatus = async () => {
        const { currentURL, currentPort } = await this.getCurrentTabUrlProperties();
        const response = await requests.getCurrentFilteringState(currentURL, currentPort);

        const { isInstalled, isRunning, isProtectionEnabled } = response.appState;
        const { isFilteringEnabled } = response.parameters;
        const { isExtensionUpdated, isSetupCorrectly } = adguard;

        const isAppWorking = [isInstalled, isRunning, isProtectionEnabled,
            isExtensionUpdated, isSetupCorrectly, isFilteringEnabled]
            .every((state) => state === true);

        return isAppWorking;
    };

    updateIconColor = async (isFilteringEnabled, tabId) => {
        let id = tabId;

        if (!tabId) {
            const tab = await this.getCurrent();
            id = tab && tab.id;
        }

        if (id) {
            if (isFilteringEnabled) {
                await actions.setIconEnabled(id);
            } else {
                await actions.setIconDisabled(id);
            }
        }
    };

    updateIconColorListener = async ({ tabId }) => {
        const isAppWorking = await this.getAppWorkingStatus();

        this.updateIconColor(isAppWorking, tabId);
    };

    updateIconColorReloadListener = async (tabId, changeInfo) => {
        if (changeInfo.status === 'loading') {
            this.updateIconColorListener({ tabId });
        }
    };

    reload = async () => {
        try {
            const tab = await this.getCurrent();
            await browser.tabs.reload(tab.id);
        } catch (error) {
            log.error(error);
        }
    };
}

const tabs = new Tabs();

export default tabs;
