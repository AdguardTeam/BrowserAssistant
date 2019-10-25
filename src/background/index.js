import browser from 'webextension-polyfill';
import requests from './requests';

global.adguard = {
    requests,
    getCurrent: async () => {
        const { id: windowId } = await browser.windows.getCurrent();
        const tabs = await browser.tabs.query({ active: true, windowId });
        return tabs[0];
    },
};
