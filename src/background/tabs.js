import browser from 'webextension-polyfill';
import { CONTENT_MESSAGES } from '../lib/types';
import log from '../lib/logger';
import { CONTENT_SCRIPT_NAME } from '../lib/consts';
import notifier from '../lib/notifier';

class Tabs {
    constructor() {
        browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' || changeInfo.status === 'loading') {
                if (tab && tab.active) {
                    notifier.notifyListeners(notifier.types.TAB_UPDATED, this.prepareTab(tab));
                }
            }
        });

        browser.tabs.onActivated.addListener(async ({ tabId }) => {
            let tab;
            try {
                tab = await browser.tabs.get(tabId);
            } catch (e) {
                log.debug(e.message);
                return; // ignore errors happening when we try to get removed tabs
            }
            if (tab && tab.active) {
                notifier.notifyListeners(notifier.types.TAB_ACTIVATED, this.prepareTab(tab));
            }
        });
    }

    /**
     * Extracts only usable data from tab
     * @param tab
     * @returns {{id: number, url: string}}
     */
    prepareTab = (tab) => {
        const { url, id } = tab;
        return { url, id };
    };

    /**
     * Returns current tab
     * Call from browser action popup in order to get correct tab
     */
    getCurrent = async () => {
        const { id: windowId } = await browser.windows.getCurrent();
        const tabs = await browser.tabs.query({ active: true, windowId });
        return this.prepareTab(tabs[0]);
    };

    getActiveTabs = async () => {
        const activeTabs = await browser.tabs.query({ active: true });
        return activeTabs.map((tab) => this.prepareTab(tab));
    };

    sendMessage = async (tabId, type, data) => {
        await browser.tabs.executeScript(tabId, { file: CONTENT_SCRIPT_NAME });
        const response = await browser.tabs.sendMessage(tabId, { type, data });
        return response;
    };

    /**
     * Retrieves referrer from content script
     * @param tab
     * @returns {Promise<string>}
     */
    getReferrer = async (tab) => {
        try {
            const response = await this.sendMessage(tab.id, CONTENT_MESSAGES.GET_REFERRER);
            return response;
        } catch (e) {
            return '';
        }
    };

    initAssistant = async (tabId) => {
        const params = { addRuleCallbackName: CONTENT_MESSAGES.ADD_RULE };
        try {
            this.sendMessage(tabId, CONTENT_MESSAGES.INIT_ASSISTANT, params);
        } catch (e) {
            log.debug(e.message);
            // ignore errors, which could happen if try to inject on service pages
        }
    };

    /**
     * Opens required url
     * @param {string} url
     * @returns {Promise<void>}
     */
    openPage = async (url) => {
        if (!url) {
            throw new Error(`Open page requires url, received, ${url}`);
        }
        await browser.tabs.create({ url });
    };

    reload = async (tab) => {
        try {
            await browser.tabs.reload(tab.id);
        } catch (error) {
            log.error(error);
        }
    };
}

const tabs = new Tabs();

export default tabs;
