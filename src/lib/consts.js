/**
 * We use a forwarder (link.adtidy.org) for outgoing links for the following reasons:
 *  1. Use mirror domains for some countries. AdGuard websites may be blocked in some countries (namely, Iran, Russia,
 *      China) and this way we can redirect the users to a working mirror.
 *  2. Keeping track of all website pages that were used in different versions AdGuard products in one place. Without
 *      that it's harder to figure out what pages are required by old apps & extensions versions.
 */
export const DOWNLOAD_LINK = 'https://link.adtidy.org/forward.html?action=download&from=popup&app=browser_assistant';
export const EXTENSION_DOWNLOAD_LINK = 'https://link.adtidy.org/forward.html?action=download_browser_assistant&from=popup&app=browser_assistant';
export const SUPPORT_LINK = 'https://link.adtidy.org/forward.html?action=support&from=popup&app=browser_assistant';
export const PURCHASE_TRIAL_EXPIRED = 'https://link.adtidy.org/forward.html?action=purchase&from=popup_trial_expired_screen&app=browser_assistant';
export const PRIVACY_URL = 'https://link.adtidy.org/forward.html?action=privacy&from=consent&app=browser_assistant';
export const TERMS_URL = 'https://link.adtidy.org/forward.html?action=eula&from=consent&app=browser_assistant';
export const DESKTOP_APPS_URL = 'https://link.adtidy.org/forward.html?action=desktop_apps&from=consent&app=browser_assistant';

export const CONTENT_SCRIPT_NAME = 'content-scripts.js';

// These urls would be updated during extension build
// Check webpack replace loader
export const UPDATE_URL_FIREFOX = '{{UPDATE_URL_FIREFOX}}';
export const UPDATE_URL_CHROME = '{{UPDATE_URL_CHROME}}';

export const PLATFORMS = {
    WINDOWS: 'windows',
    MAC: 'mac',
};

export const FILTERING_PAUSE_VERSION_SUPPORT_SINCE = {
    WINDOWS: '7.5.0',
    MAC: '2.5.0',
};
