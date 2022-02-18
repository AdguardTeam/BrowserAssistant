import browser from 'webextension-polyfill';

import log from './logger';

/**
 * Extracts only usable data from tab
 * @param tab
 * @returns {{id: number, url: string}}
 */
const prepareTab = (tab) => {
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
const getCurrentTab = async () => {
    const tabs = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });
    return prepareTab(tabs[0]);
};

/**
 * Returns all active tabs
 * @returns {Promise<{url: string, id: number}[]>}
 */
const getActiveTabs = async () => {
    const activeTabs = await browser.tabs.query({ active: true });
    return activeTabs.map((tab) => prepareTab(tab));
};

/**
 * Returns active tab
 * @returns {Promise<{url: string, id: number}>}
 */
const getActiveTab = async () => {
    const [tab] = await getActiveTabs();
    return tab;
};

/**
 * Returns all tabs with hostname similar to current active tab
 * @returns {Promise<{url: string, id: number}[]>}
 */
const getActiveAndSimilarTabs = async () => {
    const [activeTab] = await browser.tabs.query({ active: true, currentWindow: true });

    if (!activeTab) {
        log.debug('Unable to get active tab');
        return [];
    }

    const { url } = activeTab;
    if (!url) {
        log.debug('Active tab has no url');
        return [];
    }
    const urlObject = new URL(url);
    const { origin } = urlObject;

    const allTabs = await browser.tabs.query({});
    return allTabs
        .filter((tab) => tab.url.startsWith(origin))
        .map((tab) => prepareTab(tab));
};

/**
 * Opens required url
 * @param {string} url
 * @returns {Promise<void>}
 */
const openPage = async (url) => {
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
const reloadTab = async (tab) => {
    try {
        await browser.tabs.reload(tab.id);
    } catch (error) {
        log.error(error);
    }
};

/**
 * Opens postinstall page
 */
const openPostInstallPage = async () => {
    const postInstallPageUrl = browser.runtime.getURL('post-install.html');
    await openPage(postInstallPageUrl);
};

/**
 * Closes post install page if founds
 * @returns {Promise<void>}
 */
const closePostInstall = async () => {
    const postInstallPageUrl = browser.runtime.getURL('post-install.html');
    const tabs = await browser.tabs.query({});
    const postInstallTabs = tabs.filter((tab) => tab.url?.includes(postInstallPageUrl));
    postInstallTabs.forEach((tab) => {
        browser.tabs.remove(tab.id);
    });
};

export const tabs = {
    prepareTab,
    getCurrentTab,
    getActiveTabs,
    getActiveTab,
    getActiveAndSimilarTabs,
    openPage,
    reloadTab,
    openPostInstallPage,
    closePostInstall,
};
