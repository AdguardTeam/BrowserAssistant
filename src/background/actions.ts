import browser from 'webextension-polyfill';

import { Prefs } from './prefs';
// FIXME rewrite to named export
import log from '../lib/logger';
import { getErrorMessage } from '../lib/errors';
import { browserApi } from '../lib/browserApi';

type SetIconDetailsType = browser.Action.SetIconDetailsType;

const setIcon = async (details: SetIconDetailsType) => {
    try {
        await browserApi.action.setIcon(details);
    } catch (e) {
        log.debug(getErrorMessage(e));
    }
};

/**
 * Sets icon enabled. In order to remove blinking, we set the icon twice:
 * 1. for general browser action
 * 2. for tab browser action if tabId is provided
 * @param {number} [tabId]
 * @returns {Promise<void>}
 */
const setIconEnabled = async (tabId: number) => {
    const details: SetIconDetailsType = { path: Prefs.ICONS.ENABLED };
    await setIcon(details);
    if (tabId) {
        details.tabId = tabId;
        await setIcon(details);
    }
};

/**
 * Sets browser cation icon disabled. In order to remove blinking, we set the icon twice:
 * 1. for general browser action
 * 2. for tab browser action if tabId is provided
 * @param {number} [tabId]
 * @returns {Promise<void>}
 */
const setIconDisabled = async (tabId: number) => {
    const details: SetIconDetailsType = { path: Prefs.ICONS.DISABLED };
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
