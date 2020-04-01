import browser from 'webextension-polyfill';
import log from '../lib/logger';
import { Prefs } from './prefs';

const setIcon = async (tabId, iconPath) => {
    const details = {
        path: iconPath,
    };

    if (tabId) {
        details.tabId = tabId;
    }

    try {
        await browser.browserAction.setIcon(details);
    } catch (e) {
        log.debug(e.message);
    }
};

const setIconEnabled = (tabId) => {
    return setIcon(tabId, Prefs.ICONS.ENABLED);
};

const setIconDisabled = (tabId) => {
    return setIcon(tabId, Prefs.ICONS.DISABLED);
};

const actions = {
    setIconEnabled,
    setIconDisabled,
};

export default actions;
