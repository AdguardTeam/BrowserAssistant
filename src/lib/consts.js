export const DOWNLOAD_LINK = 'https://adguard.com/forward.html?action=download&from=popup&app=browser_assistant';
export const CONTENT_SCRIPT_NAME = 'content-scripts.js';
export const ICON_COLORS = {
    GREEN: 'green',
    GREY: 'grey',
};
export const browserLocale = navigator.language.slice(0, 2);

// These urls would be updated during extension build
// Check webpack replace loader
export const UPDATE_URL_FIREFOX = '{{UPDATE_URL_FIREFOX}}';
export const UPDATE_URL_CHROME = '{{UPDATE_URL_CHROME}}';
