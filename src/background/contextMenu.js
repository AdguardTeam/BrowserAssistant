import browser from 'webextension-polyfill';
import state from './state';
import tabs from './tabs';
import filteringPause from './filteringPause';

const messages = {
    context_site_protection_disabled: 'context_site_protection_disabled',
    context_site_filtering_disabled: 'context_site_filtering_disabled',
    context_site_filtering_on: 'context_site_filtering_on',
    context_site_filtering_off: 'context_site_filtering_off',
    context_block_site_ads: 'context_block_site_ads',
    context_complaint_website: 'context_complaint_website',
    context_enable_protection: 'context_enable_protection',
    context_disable_protection: 'context_disable_protection',
    context_open_settings: 'context_open_settings',
    context_open_log: 'context_open_log',
    pause_filtering: 'pause_filtering',
};

const contextMenuCallbackMappings = {
    [messages.context_block_site_ads]: async () => {
        const { id } = await tabs.getActiveTab();
        await tabs.initAssistant(id);
    },
    [messages.context_complaint_website]: async () => {
        const tab = await tabs.getActiveTab();
        const referrer = await tabs.getReferrer(tab);
        const reportUrl = await state.reportSite(tab.url, referrer);
        await tabs.openPage(reportUrl);
    },
    [messages.context_site_filtering_on]: async () => {
        const tab = await tabs.getActiveTab();
        await state.setFilteringStatus(
            true,
            state.urlInfo.isHttpsFilteringEnabled,
            tab.url
        );
        await filteringPause.clearHostnameTimeout(tab.url);
        await tabs.reload(tab);
    },
    [messages.context_site_filtering_off]: async () => {
        const tab = await tabs.getActiveTab();
        await state.setFilteringStatus(
            false,
            state.urlInfo.isHttpsFilteringEnabled,
            tab.url
        );
        await filteringPause.clearHostnameTimeout(tab.url);
        await tabs.reload(tab);
    },
    [messages.context_enable_protection]: async () => {
        state.setProtectionStatus(true);

        const tab = await tabs.getActiveTab();
        await tabs.reload(tab);
    },
    [messages.context_disable_protection]: async () => {
        state.setProtectionStatus(false);

        const tab = await tabs.getActiveTab();
        await tabs.reload(tab);
    },
    [messages.context_open_settings]: () => {
        state.openSettings();
    },
    [messages.context_open_log]: () => {
        state.openFilteringLog();
    },
    [messages.pause_filtering]: async () => {
        const tab = await tabs.getActiveTab();

        await filteringPause.handleFilteringPause(tab.url);
        await tabs.reload(tab);
    },
};

/**
 * Creates context menu item
 * @param title {string} - id
 * @param [onclick] {function}  - onclick handler
 */
const addMenuItem = (title, onclick = contextMenuCallbackMappings[title]) => {
    const menuItem = {
        contexts: ['all'],
        title: browser.i18n.getMessage(title),
    };

    if (typeof onclick === 'function') {
        menuItem.onclick = onclick;
    }

    browser.contextMenus.create(menuItem);
};

const addSeparator = () => {
    browser.contextMenus.create({
        type: 'separator',
    });
};

const updateContextMenu = () => {
    if (!state.appState.isProtectionEnabled) {
        addMenuItem(messages.context_site_protection_disabled);
        addSeparator();
        addMenuItem(messages.context_open_log);
        addMenuItem(messages.context_open_settings);
        addMenuItem(messages.context_enable_protection);
    } else if (state.urlInfo.isSecured) {
        addMenuItem(messages.context_site_filtering_disabled);
        addSeparator();
        addMenuItem(messages.context_open_log);
        addMenuItem(messages.context_open_settings);
    } else {
        if (state.urlInfo.isFilteringEnabled) {
            addMenuItem(messages.context_site_filtering_off);
            addSeparator();
            addMenuItem(messages.pause_filtering);
            addMenuItem(messages.context_block_site_ads);
        } else {
            addMenuItem(messages.context_site_filtering_on);
            addSeparator();
        }
        addMenuItem(messages.context_complaint_website);
        addSeparator();
        addMenuItem(messages.context_open_settings);
        addMenuItem(messages.context_open_log);
        addMenuItem(messages.context_disable_protection);
    }
};

export const customizeContextMenu = () => {
    // clear old menu items before updating
    browser.contextMenus.removeAll();
    updateContextMenu();
};
