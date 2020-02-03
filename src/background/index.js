import browser from 'webextension-polyfill';
import requests from './requestsApi';
import api from './Api';
import { MessageTypes, RequestTypes } from '../lib/types';
import tabs from './tabs';
import log from '../lib/logger';

// eslint-disable-next-line consistent-return
async function sendMessage(sender) {
    const { type } = sender;
    const tab = await adguard.tabs.getCurrent();
    const response = await browser.tabs.sendMessage(tab.id, { type });
    if (response) {
        return Promise.resolve(response);
    }
}

function addRule(sender) {
    const { ruleText } = sender;
    adguard.requests.addRule(ruleText);
    adguard.tabs.isPageFilteredByUserFilter = true;
}

function handleMessage(sender) {
    switch (sender.type) {
        case MessageTypes.initAssistant:
            return sendMessage(sender);
        case MessageTypes.getReferrer:
            return sendMessage(sender);
        case RequestTypes.addRule:
            return addRule(sender);
        default:
            return null;
    }
}


global.adguard = {
    requests,
    tabs,
    isAppUpToDate: api.isAppUpToDate,
    isExtensionUpdated: api.isExtensionUpdated,
};

try {
    api.init();

    browser.runtime.onMessage.addListener(handleMessage);
} catch (error) {
    log.error(error.message);
}
