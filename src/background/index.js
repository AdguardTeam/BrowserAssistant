import browser from 'webextension-polyfill';
import requests from './requestsApi';
import { Api } from './Api';
import { ContentScriptRequestsTypes } from '../lib/types';
import tabs from './tabs';

Api.init();
requests.init();

async function sendRequest(type, sender, sendResponse) {
    if (sender.type === type) {
        const tab = await adguard.tabs.getCurrent();
        const response = await browser.tabs.sendMessage(tab.id, { type });
        if (response) {
            sendResponse(response);
        }
    }
}

browser.runtime.onMessage.addListener(async (sender, data, sendResponse) => {
    console.log(sender, data, sendResponse);
    sendRequest(ContentScriptRequestsTypes.getReferrer, sender, sendResponse);
    sendRequest(ContentScriptRequestsTypes.initAssistant, sender, sendResponse);
    // if (sender.type === ContentScriptRequestsTypes.getReferrer) {
    //     const tab = await adguard.tabs.getCurrent();
    //     const response = await browser.tabs.sendMessage(tab.id,
    //         { type: ContentScriptRequestsTypes.getReferrer });
    //     if (response) {
    //         sendResponse(response);
    //     }
    // }
    // if (sender.type === ContentScriptRequestsTypes.initAssistant) {
    //     const tab = await adguard.tabs.getCurrent();
    //     const response = await browser.tabs.sendMessage(tab.id,
    //         { type: ContentScriptRequestsTypes.initAssistant });
    //     if (response) {
    //         sendResponse(response);
    //     }
    // }
});

global.adguard = {
    requests,
    tabs,
};
