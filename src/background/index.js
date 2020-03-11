import browser from 'webextension-polyfill';
import requests from './requestsApi';
import api from './Api';
import {
    INNER_MESSAGING_TYPES, MESSAGE_TYPES, REQUEST_TYPES,
} from '../lib/types';
import tabs from './tabs';
import log from '../lib/logger';
import browserApi from './browserApi';

// eslint-disable-next-line consistent-return
async function sendMessage(msg) {
    const { type } = msg;
    const tab = await tabs.getCurrent();
    const response = await browser.tabs.sendMessage(tab.id, { type });
    if (response) {
        return Promise.resolve(response);
    }
}

function addRule(msg) {
    const { ruleText } = msg;
    requests.addRule(ruleText);
}

async function handleMessage(msg) {
    switch (msg.type) {
        case MESSAGE_TYPES.initAssistant:
        case MESSAGE_TYPES.getReferrer:
            await sendMessage(msg);
            break;
        case REQUEST_TYPES.addRule:
            await addRule(msg);
            break;
        default:
            break;
    }

    const { apiType, result, params } = msg;

    const mapApiTypeToApi = {
        [INNER_MESSAGING_TYPES.API_REQUEST]: requests,
        [INNER_MESSAGING_TYPES.TAB_ACTION]: tabs,
    };

    try {
        const response = await mapApiTypeToApi[apiType][result].apply(null, params);

        await browserApi.runtime.sendMessage({
            result,
            response,
        });
    } catch (error) {
        // Ignore message
    }
}

try {
    api.init();

    browser.runtime.onMessage.addListener(handleMessage);
    browser.tabs.onActivated.addListener(tabs.updateIconColorListener);
    browser.tabs.onUpdated.addListener(tabs.updateIconColorReloadListener);
} catch (error) {
    log.error(error);
}
