import browser from 'webextension-polyfill';
import requests from './requestsApi';
import { Api } from './Api';
import { ContentScriptRequestsTypes } from './types';
import tabs from './tabs';

Api.init();
requests.init();

browser.runtime.onMessage.addListener(async (sender, data, sendResponse) => {
    if (sender.type === ContentScriptRequestsTypes.getReferrer) {
        const tab = await adguard.tabs.getCurrent();
        const response = await browser.tabs.sendMessage(tab.id,
            { type: ContentScriptRequestsTypes.getReferrer });
        if (response) {
            sendResponse(response);
        }
    }
});
global.adguard = {
    requests,
    tabs,
};
console.log(global);
