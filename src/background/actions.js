import browser from 'webextension-polyfill';
import { Prefs } from './prefs';
import { ICON_COLORS } from '../lib/consts';

const setIcon = async (path, tabId) => {
    const details = { path };
    if (tabId) {
        details.tabId = tabId;
    }
    try {
        await browser.browserAction.setIcon(details);
    } catch (error) {
        // Ignore message 'No tab with id: 123' after closing many tabs quickly
    }
};

const setIconEnabled = (tabId) => setIcon(Prefs.ICONS[ICON_COLORS.GREEN], tabId);

const setIconDisabled = (tabId) => setIcon(Prefs.ICONS[ICON_COLORS.GREY], tabId);

const actions = {
    setIconEnabled,
    setIconDisabled,
};

export default actions;
