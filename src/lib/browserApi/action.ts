import browser from 'webextension-polyfill';

export const action = browser.browserAction || browser.action;
