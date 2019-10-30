import browser from 'webextension-polyfill';
import requests from './requestsApi';
import { Api } from './Api';
import tabs from './tabs';

Api.init();
requests.init();

browser.runtime.onMessage.addListener(async (sender, data, sendResponse) => {
    if (sender.type === 'getReferrer') {
        const tabs = await browser.tabs.query({});
        for (let i = 0; i < tabs.length; i += 1) {
            const tab = tabs[i];
            // eslint-disable-next-line no-await-in-loop
            const response = await browser.tabs.sendMessage(tab.id, { type: 'getReferrer' });
            if (response) {
                sendResponse(response);
            }
        }
    }
});

global.adguard = {
    requests,
    tabs,
};
