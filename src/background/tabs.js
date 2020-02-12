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
        const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
        if (!tab.url) {
            log.error('Browser tabs api error: no url property in the current tab. Checkout tabs permission in the manifest.', tab);
            this.isSetupCorrectly = false;
            await browserApi.runtime.sendMessage({ result: BACKGROUND_COMMANDS.SHOW_RELOAD });
            setTimeout(() => browserApi.runtime.sendMessage(
                { result: BACKGROUND_COMMANDS.SHOW_SETUP_INCORRECTLY }
            ),
            1000);
        }
        return tab;
    };

    sendMessage = async (type, options) => {
        const tab = await this.getCurrent();
        return browser.tabs.sendMessage(tab.id, { type, options }).catch((error) => {
            if (!browser.runtime.lastError) {
                log.error(error);
            }
        });
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

    openDownloadPage = () => {
        browser.tabs.create({ url: DOWNLOAD_LINK });
    };

    getCurrentTabUrlProperties = async () => {
        const tab = await this.getCurrent();
        const { url } = tab;

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

    getFilteringStatus = async () => {
        const { currentURL, currentPort } = await this.getCurrentTabUrlProperties();
        const response = await requests.getCurrentFilteringState(currentURL, currentPort);

        return response.parameters && response.parameters.isFilteringEnabled;
    };

    updateIconColor = async (isFilteringEnabled, tabId) => {
        const id = tabId || (await this.getCurrent()).id;

        return isFilteringEnabled ? actions.setIconEnabled(id) : actions.setIconDisabled(id);
    };

    updateIconColorListener = async ({ tabId }) => {
        const isFilteringEnabled = await this.getFilteringStatus();

        this.updateIconColor(isFilteringEnabled, tabId);
    }
}

const tabs = new Tabs();

export default tabs;
