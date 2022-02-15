import browser from 'webextension-polyfill';
import { CONTENT_MESSAGES } from '../lib/types';
import log from '../lib/logger';
import { CONTENT_SCRIPT_NAME } from '../lib/consts';
import notifier from '../lib/notifier';
import filteringPause from './filteringPause';

/**
 * Manages interaction with tabs
 */
class Tabs {
    constructor() {
        browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' || changeInfo.status === 'loading') {
                const hostname = filteringPause.getUrlHostname(tab.url);

                if (filteringPause.hostnameToTimeoutMap[hostname] < 0) {
                    filteringPause.deleteHostnameTimeout(tab.url);
                }

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
        const { url, id, title } = tab;
        return {
            url,
            id,
            title,
        };
    };

    /**
     * Returns current tab
     * Call from browser action popup in order to get correct tab
     */
    getCurrent = async () => {
        const tabs = await browser.tabs.query({
            active: true,
            currentWindow: true,
        });
        return this.prepareTab(tabs[0]);
    };

    /**
     * Returns all active tabs
     * @returns {Promise<{url: string, id: number}[]>}
     */
    getActiveTabs = async () => {
        const activeTabs = await browser.tabs.query({ active: true });
        return activeTabs.map((tab) => this.prepareTab(tab));
    };

    /**
     * Returns active tab
     * @returns {Promise<{url: string, id: number}>}
     */
    getActiveTab = async () => {
        const [tab] = await this.getActiveTabs();
        return tab;
    };

    /**
     * Returns all tabs with hostname similar to current active tab
     * @returns {Promise<{url: string, id: number}[]>}
     */
    getActiveAndSimilarTabs = async () => {
        const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });

        if (!activeTab) {
            log.debug('Unable to get active tab');
            return [];
        }

        const { url } = activeTab;
        const urlObject = new URL(url);
        const { hostname } = urlObject;

        const allTabs = await browser.tabs.query({});
        return allTabs
            .filter((tab) => tab.url.includes(hostname))
            .map((tab) => this.prepareTab(tab));
    };

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
            this.sendMessage(tabId, CONTENT_MESSAGES.INIT_ASSISTANT, data);
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

    /**
     * Reloads required tab
     * @param tab
     * @returns {Promise<void>}
     */
    reload = async (tab) => {
        try {
            await browser.tabs.reload(tab.id);
        } catch (error) {
            log.error(error);
        }
    };

    /**
     * Opens postinstall page
     */
    openPostInstallPage = async () => {
        const postInstallPageUrl = browser.runtime.getURL('post-install.html');
        await this.openPage(postInstallPageUrl);
    }

    /**
     * Closes post install page if founds
     * @returns {Promise<void>}
     */
    closePostInstall = async () => {
        const postInstallPageUrl = browser.runtime.getURL('post-install.html');
        const tabs = await browser.tabs.query({});
        const postInstallTabs = tabs.filter((tab) => tab.url?.includes(postInstallPageUrl));
        postInstallTabs.forEach((tab) => {
            browser.tabs.remove(tab.id);
        });
    };

    /**
     * Closes tabs
     */
    closeTab = async (tabId) => {
        await browser.tabs.remove(tabId);
    }
}

const tabs = new Tabs();

export default tabs;
