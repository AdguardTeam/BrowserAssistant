import browser from 'webextension-polyfill';
import { nanoid } from 'nanoid';

import state from './state';
import { tabsService } from './TabsService';
import { tabs } from '../lib/tabs';
import filteringPause from './filteringPause';
import { settings } from './settings';
import notifier from '../lib/notifier';

export type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>;

type CreateProps = RequiredField<browser.Menus.CreateCreatePropertiesType, 'id'>;

// Context menu items names and translation keys
enum ContextMenuItem {
    SiteProtectionDisabled = 'context_site_protection_disabled',
    SiteFilteringDisabled = 'context_site_filtering_disabled',
    SiteFilteringOn = 'context_site_filtering_on',
    SiteFilteringOff = 'context_site_filtering_off',
    BlockSiteAds = 'context_block_site_ads',
    ComplaintWebsite = 'context_complaint_website',
    EnableProtection = 'context_enable_protection',
    DisableProtection = 'context_disable_protection',
    OpenSettings = 'context_open_settings',
    OpenLog = 'context_open_log',
    PauseFiltering = 'pause_filtering',
}

type OnClickedType = {
    (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab): Promise<void>
};

type ClickHandlersType = {
    [key in Partial<ContextMenuItem>]?: OnClickedType
};

export class ContextMenu {
    /**
     * Click handlers
     */
    static clickHandlers: ClickHandlersType = {
        [ContextMenuItem.BlockSiteAds]: async () => {
            const { id } = await tabs.getActiveTab();
            await tabsService.initAssistant(id);
        },
        [ContextMenuItem.ComplaintWebsite]: async () => {
            const tab = await tabs.getActiveTab();
            const referrer = await tabsService.getReferrer(tab);
            const reportUrl = await state.reportSite(tab.url, referrer);
            await tabs.openPage(reportUrl);
        },
        [ContextMenuItem.SiteFilteringOn]: async () => {
            const tabsToUpdate = await tabs.getActiveAndSimilarTabs();

            await Promise.all(tabsToUpdate.map(async (tab) => {
                await state.setFilteringStatus(
                    true,
                    state.urlInfo.isHttpsFilteringEnabled,
                    tab.url,
                );
                await filteringPause.clearHostnameTimeout(tab.url);
                await tabs.reloadTab(tab);
            }));
        },
        [ContextMenuItem.SiteFilteringOff]: async () => {
            const tabsToUpdate = await tabs.getActiveAndSimilarTabs();

            await Promise.all(tabsToUpdate.map(async (tab) => {
                await state.setFilteringStatus(
                    false,
                    state.urlInfo.isHttpsFilteringEnabled,
                    tab.url,
                );
                await filteringPause.clearHostnameTimeout(tab.url);
                await tabs.reloadTab(tab);
            }));
        },
        [ContextMenuItem.EnableProtection]: async () => {
            const tabsToUpdate = await tabs.getActiveAndSimilarTabs();

            await Promise.all(tabsToUpdate.map(async (tab) => {
                await state.setProtectionStatus(true);
                await tabs.reloadTab(tab);
            }));
        },
        [ContextMenuItem.DisableProtection]: async () => {
            const tabsToUpdate = await tabs.getActiveAndSimilarTabs();

            await Promise.all(tabsToUpdate.map(async (tab) => {
                await state.setProtectionStatus(false);
                await tabs.reloadTab(tab);
            }));
        },
        [ContextMenuItem.OpenSettings]: async () => {
            await state.openSettings();
        },
        [ContextMenuItem.OpenLog]: async () => {
            await state.openFilteringLog();
        },
        [ContextMenuItem.PauseFiltering]: async () => {
            const tabsToUpdate = await tabs.getActiveAndSimilarTabs();

            await Promise.all(tabsToUpdate.map(async (tab) => {
                await filteringPause.handleFilteringPause(tab.url);
                await tabs.reloadTab(tab);
            }));
        },
    };

    /**
     * Adds listeners, should be on the upper level
     */
    public static init() {
        notifier.addSpecifiedListener(
            // TODO fix types, convert notifier to typescript code
            // @ts-ignore
            notifier.types.SETTING_UPDATED,
            ContextMenu.update,
        );

        chrome.contextMenus.onClicked.addListener(ContextMenu.onClicked);
    }

    /**
     * Updates context menu
     */
    public static async update() {
        // clear old menu items before updating
        await browser.contextMenus.removeAll();

        if (settings.contextMenuEnabled()) {
            await ContextMenu.buildContextMenu();
        }
    }

    /**
     * Builds context menu
     */
    static async buildContextMenu() {
        if (!state.isAppWorking()) {
            await ContextMenu.addMenuItem(ContextMenuItem.EnableProtection);
            return;
        }
        if (!state.appState.isAuthorized) {
            await ContextMenu.addMenuItem(ContextMenuItem.OpenSettings);
            await ContextMenu.addSeparator();
            await ContextMenu.addMenuItem(ContextMenuItem.OpenLog);
            return;
        }
        if (!state.appState.isProtectionEnabled) {
            await ContextMenu.addMenuItem(ContextMenuItem.SiteProtectionDisabled, false);
            await ContextMenu.addSeparator();
            await ContextMenu.addMenuItem(ContextMenuItem.OpenLog);
            await ContextMenu.addMenuItem(ContextMenuItem.OpenSettings);
            await ContextMenu.addMenuItem(ContextMenuItem.EnableProtection);
        } else if (state.urlInfo.isSecured) {
            await ContextMenu.addMenuItem(ContextMenuItem.SiteFilteringDisabled);
            await ContextMenu.addSeparator();
            await ContextMenu.addMenuItem(ContextMenuItem.OpenLog);
            await ContextMenu.addMenuItem(ContextMenuItem.OpenSettings);
        } else {
            if (state.urlInfo.isFilteringEnabled
                && state.urlInfo.canChangeFilteringStatus) {
                await ContextMenu.addMenuItem(ContextMenuItem.SiteFilteringOff);
                await ContextMenu.addSeparator();
                await ContextMenu.addMenuItem(ContextMenuItem.PauseFiltering);
                await ContextMenu.addMenuItem(ContextMenuItem.BlockSiteAds);
            } else if (state.urlInfo.canChangeFilteringStatus) {
                await ContextMenu.addMenuItem(ContextMenuItem.SiteFilteringOn);
                await ContextMenu.addSeparator();
            }
            await ContextMenu.addMenuItem(ContextMenuItem.ComplaintWebsite);
            await ContextMenu.addSeparator();
            await ContextMenu.addMenuItem(ContextMenuItem.OpenSettings);
            await ContextMenu.addMenuItem(ContextMenuItem.OpenLog);
            await ContextMenu.addMenuItem(ContextMenuItem.DisableProtection);
        }
    }

    /**
     * Handles context menu item click with right handler
     * @param info
     * @param tab
     */
    static onClicked(info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) {
        const clickHandler = ContextMenu.clickHandlers[info.menuItemId as ContextMenuItem];
        if (!clickHandler) {
            return;
        }

        clickHandler(info, tab);
    }

    /**
     * Creates context menu item
     * @param menuItemId - i18 key
     * @param enabled
     */
    static addMenuItem = async (menuItemId: ContextMenuItem, enabled = true) => {
        const menuItem: CreateProps = {
            id: menuItemId,
            contexts: ['all'],
            title: browser.i18n.getMessage(menuItemId),
            enabled,
        };

        await browser.contextMenus.create(menuItem);
    };

    /**
     * Creates context menu separator
     */
    static addSeparator = async () => {
        const menuItem: CreateProps = {
            id: nanoid(),
            contexts: ['all'],
            type: 'separator',
        };

        await browser.contextMenus.create(menuItem);
    };
}
