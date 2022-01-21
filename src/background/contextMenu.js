import browser from 'webextension-polyfill';

import state from './state';
import tabs from './tabs';
import filteringPause from './filteringPause';
import { settings } from './settings';
import notifier from '../lib/notifier';

// Context menu items names and translations keys
const CONTEXT_MENU_ITEMS = {
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
    [CONTEXT_MENU_ITEMS.context_block_site_ads]: async () => {
        const { id } = await tabs.getActiveTab();
        await tabs.initAssistant(id);
    },
    [CONTEXT_MENU_ITEMS.context_complaint_website]: async () => {
        const tab = await tabs.getActiveTab();
        const referrer = await tabs.getReferrer(tab);
        const reportUrl = await state.reportSite(tab.url, referrer);
        await tabs.openPage(reportUrl);
    },
    [CONTEXT_MENU_ITEMS.context_site_filtering_on]: async () => {
        const tab = await tabs.getActiveTab();
        await state.setFilteringStatus(
            true,
            state.urlInfo.isHttpsFilteringEnabled,
            tab.url
        );
        await filteringPause.clearHostnameTimeout(tab.url);
        await tabs.reload(tab);
    },
    [CONTEXT_MENU_ITEMS.context_site_filtering_off]: async () => {
        const tab = await tabs.getActiveTab();
        await state.setFilteringStatus(
            false,
            state.urlInfo.isHttpsFilteringEnabled,
            tab.url
        );
        await filteringPause.clearHostnameTimeout(tab.url);
        await tabs.reload(tab);
    },
    [CONTEXT_MENU_ITEMS.context_enable_protection]: async () => {
        state.setProtectionStatus(true);

        const tab = await tabs.getActiveTab();
        await tabs.reload(tab);
    },
    [CONTEXT_MENU_ITEMS.context_disable_protection]: async () => {
        state.setProtectionStatus(false);

        const tab = await tabs.getActiveTab();
        await tabs.reload(tab);
    },
    [CONTEXT_MENU_ITEMS.context_open_settings]: () => {
        state.openSettings();
    },
    [CONTEXT_MENU_ITEMS.context_open_log]: () => {
        state.openFilteringLog();
    },
    [CONTEXT_MENU_ITEMS.pause_filtering]: async () => {
        const tab = await tabs.getActiveTab();

        await filteringPause.handleFilteringPause(tab.url);
        await tabs.reload(tab);
    },
};

/**
 * Creates context menu item
 * @param i18key {string} - i18 key
 * @param {boolean} enabled
 */
const addMenuItem = (i18key, enabled = true) => {
    const onclick = contextMenuCallbackMappings[i18key];

    const menuItem = {
        contexts: ['all'],
        title: browser.i18n.getMessage(i18key),
        enabled,
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
    if (!state.isAppWorking()) {
        return;
    }
    if (!state.appState.isAuthorized) {
        addMenuItem(CONTEXT_MENU_ITEMS.context_open_settings);
        addSeparator();
        addMenuItem(CONTEXT_MENU_ITEMS.context_open_log);
        return;
    }
    if (!state.appState.isProtectionEnabled) {
        addMenuItem(CONTEXT_MENU_ITEMS.context_site_protection_disabled, false);
        addSeparator();
        addMenuItem(CONTEXT_MENU_ITEMS.context_open_log);
        addMenuItem(CONTEXT_MENU_ITEMS.context_open_settings);
        addMenuItem(CONTEXT_MENU_ITEMS.context_enable_protection);
    } else if (state.urlInfo.isSecured) {
        addMenuItem(CONTEXT_MENU_ITEMS.context_site_filtering_disabled);
        addSeparator();
        addMenuItem(CONTEXT_MENU_ITEMS.context_open_log);
        addMenuItem(CONTEXT_MENU_ITEMS.context_open_settings);
    } else {
        if (state.urlInfo.isFilteringEnabled) {
            addMenuItem(CONTEXT_MENU_ITEMS.context_site_filtering_off);
            addSeparator();
            addMenuItem(CONTEXT_MENU_ITEMS.pause_filtering);
            addMenuItem(CONTEXT_MENU_ITEMS.context_block_site_ads);
        } else {
            addMenuItem(CONTEXT_MENU_ITEMS.context_site_filtering_on);
            addSeparator();
        }
        addMenuItem(CONTEXT_MENU_ITEMS.context_complaint_website);
        addSeparator();
        addMenuItem(CONTEXT_MENU_ITEMS.context_open_settings);
        addMenuItem(CONTEXT_MENU_ITEMS.context_open_log);
        addMenuItem(CONTEXT_MENU_ITEMS.context_disable_protection);
    }
};

const customizeContextMenu = () => {
    // clear old menu items before updating
    browser.contextMenus.removeAll();
    if (settings.contextMenuEnabled()) {
        updateContextMenu();
    }
};

const init = () => {
    notifier.addSpecifiedListener(
        notifier.types.SETTING_UPDATED,
        customizeContextMenu
    );
};

export const contextMenu = {
    init,
    customizeContextMenu,
};
