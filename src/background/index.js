import browser from 'webextension-polyfill';
import requests from './requestsApi';
import api from './Api';
import { MessageTypes, RequestTypes } from '../lib/types';
import tabs from './tabs';

api.init();
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
    await sendRequest(MessageTypes.initAssistant, sender, sendResponse);
    await sendRequest(MessageTypes.getReferrer, sender, sendResponse);

    if (sender.type === RequestTypes.addRule) {
        const { ruleText } = sender;
        adguard.requests.addRule(ruleText);
        adguard.tabs.isPageChanged = true;
    }
});

global.adguard = {
    requests,
    tabs,
};

adguard.tabs.getCurrent();
