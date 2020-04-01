import browser from 'webextension-polyfill';
import { Prefs } from './prefs';

const setIcon = async (tabId, iconPath) => {
    const details = { iconPath };
    if (tabId) {
        details.tabId = tabId;
    }
    try {
        await browser.browserAction.setIcon(details);
    } catch (error) {
        // Ignore message 'No tab with id: 123' after closing many tabs quickly
    }
};

const setIconEnabled = (tabId) => setIcon(tabId, Prefs.ICONS.ENABLED);

const setIconDisabled = (tabId) => setIcon(tabId, Prefs.ICONS.DISABLED);

const actions = {
    setIconEnabled,
    setIconDisabled,
};

export default actions;
