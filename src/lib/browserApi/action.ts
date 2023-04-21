import browser from 'webextension-polyfill';

// This for support mv3 and mv2
export const action = browser.browserAction || browser.action;
