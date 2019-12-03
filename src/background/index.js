import browser from 'webextension-polyfill';
import requests from './requestsApi';
import api from './Api';
import { MessageTypes, RequestTypes } from '../lib/types';
import tabs from './tabs';

api.init();

async function sendMessage(sender, sendResponse) {
    const { type } = sender;
    const tab = await adguard.tabs.getCurrent();
    const response = await browser.tabs.sendMessage(tab.id, { type });
    if (response) {
        sendResponse(response);
    }
}

function addRule(sender) {
    const { ruleText } = sender;
    adguard.requests.addRule(ruleText);
    adguard.tabs.isPageFilteredByUserFilter = true;
    adguard.tabs.reloadCurrentPage();
}

function handleMessage(sender, data, sendResponse) {
    switch (sender.type) {
        case MessageTypes.initAssistant:
            return sendMessage(sender, sendResponse);
        case MessageTypes.getReferrer:
            return sendMessage(sender, sendResponse);
        case RequestTypes.addRule:
            return addRule(sender);
        default:
            return null;
    }
}

browser.runtime.onMessage.addListener(handleMessage);

global.adguard = {
    requests,
    tabs,
    isAppUpToDate: api.isAppUpToDate,
    isExtensionUpdated: api.isExtensionUpdated,
};
