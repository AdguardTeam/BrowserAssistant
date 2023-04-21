import browser from 'webextension-polyfill';
import { CONTENT_MESSAGES } from '../lib/types';
import log from '../lib/logger';
import { CONTENT_SCRIPT_NAME } from '../lib/consts';
import { tabs } from '../lib/tabs';
import notifier from '../lib/notifier';
import filteringPause from './filteringPause';

/**
 * Manages interaction with tabs
 */
class TabsService {
    constructor() {
        browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' || changeInfo.status === 'loading') {
                const hostname = filteringPause.getUrlHostname(tab.url);

                if (filteringPause.hostnameToTimeoutMap[hostname] < 0) {
                    filteringPause.deleteHostnameTimeout(tab.url);
                }

                if (tab && tab.active) {
                    notifier.notifyListeners(notifier.types.TAB_UPDATED, tabs.prepareTab(tab));
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
                notifier.notifyListeners(notifier.types.TAB_ACTIVATED, tabs.prepareTab(tab));
            }
        });
    }

    /**
     * Sends message to the tab, previously executing there content script
     * @param tabId
     * @param type
     * @param data
     * @returns {Promise<*>}
     */
    sendMessage = async (tabId, type, data) => {
        await browser.tabs.executeScript(tabId, { file: CONTENT_SCRIPT_NAME });

        const response = await browser.tabs.sendMessage(tabId, {
            type,
            data,
        });
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

    /**
     * Sends message to init assistant on the page, and passes it callback name
     * @param tabId
     * @returns {Promise<void>}
     */
    initAssistant = async (tabId) => {
        const data = { addRuleCallbackName: CONTENT_MESSAGES.ADD_RULE };
        try {
            await this.sendMessage(tabId, CONTENT_MESSAGES.INIT_ASSISTANT, data);
        } catch (e) {
            log.debug(e.message);
        }
    };
}

export const tabsService = new TabsService();
