import browser from 'webextension-polyfill';
import log from '../lib/logger';
import { Prefs } from './prefs';

const setIcon = async (details) => {
    try {
        await browser.browserAction.setIcon(details);
    } catch (e) {
        log.debug(e.message);
    }
};

/**
 * Sets icon enabled. In order to remove blinking we set icon twice:
 * 1. for general browser action
 * 2. for tab browser action if tabId is provided
 * @param {number} [tabId]
 * @returns {Promise<void>}
 */
const setIconEnabled = async (tabId) => {
    const details = { path: Prefs.ICONS.ENABLED };
    await setIcon(details);
    if (tabId) {
        details.tabId = tabId;
        await setIcon(details);
    }
};

/**
 * Sets browser cation icon disabled. In order to remove blinking we set icon twice:
 * 1. for general browser action
 * 2. for tab browser action if tabId is provided
 * @param {number} [tabId]
 * @returns {Promise<void>}
 */
const setIconDisabled = async (tabId) => {
    const details = { path: Prefs.ICONS.DISABLED };
    await setIcon(details);
    if (tabId) {
        details.tabId = tabId;
        await setIcon(details);
    }
};

const actions = {
    setIconEnabled,
    setIconDisabled,
};

export default actions;
