import browser from 'webextension-polyfill';
import { Prefs } from './prefs';
import { ICON_COLORS } from '../lib/conts';

const setIcon = (path, tabId) => browser.browserAction.setIcon({ path, tabId });

const setIconEnabled = (tabId) => setIcon(Prefs.ICONS[ICON_COLORS.GREEN], tabId);

const setIconDisabled = (tabId) => setIcon(Prefs.ICONS[ICON_COLORS.GREY], tabId);

const setIconWarning = (tabId) => setIcon(Prefs.ICONS[ICON_COLORS.ORANGE], tabId);

const actions = {
    setIconEnabled,
    setIconDisabled,
    setIconWarning,
};

export default actions;
