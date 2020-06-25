export const DOWNLOAD_LINK = 'https://adguard.com/forward.html?action=download&from=popup&app=browser_assistant';
export const EXTENSION_DOWNLOAD_LINK = 'https://adguard.com/forward.html?action=download_browser_assistant&from=popup&app=browser_assistant';
export const CONTENT_SCRIPT_NAME = 'content-scripts.js';

// These urls would be updated during extension build
// Check webpack replace loader
export const UPDATE_URL_FIREFOX = '{{UPDATE_URL_FIREFOX}}';
export const UPDATE_URL_CHROME = '{{UPDATE_URL_CHROME}}';

export const FILTERING_PAUSE_TIMEOUT_MS = 30000;
export const FILTERING_PAUSE_TIMER_TICK_MS = 1000;
export const PLATFORMS = {
    WINDOWS: 'windows',
    MAC: 'mac',
};
export const FILTERING_PAUSE_VERSION_SUPPORT_SINCE = '7.5';
