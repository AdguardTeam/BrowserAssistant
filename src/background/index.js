import browser from 'webextension-polyfill';
import requests from './requestsApi';
import api from './Api';
import {
    INNER_MESSAGING_TYPES, MESSAGE_TYPES, REQUEST_TYPES,
} from '../lib/types';
import tabs from './tabs';
import log from '../lib/logger';

// eslint-disable-next-line consistent-return
async function sendMessage(sender) {
    const { type } = sender;
    const tab = await tabs.getCurrent();
    const response = await browser.tabs.sendMessage(tab.id, { type });
    if (response) {
        return Promise.resolve(response);
    }
}

function addRule(sender) {
    const { ruleText } = sender;
    requests.addRule(ruleText);
}

function handleMessage(sender) {
    switch (sender.type) {
        case MESSAGE_TYPES.initAssistant:
            return sendMessage(sender);
        case MESSAGE_TYPES.getReferrer:
            return sendMessage(sender);
        case REQUEST_TYPES.addRule:
            return addRule(sender);
        default:
            return null;
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

const onConnected = (port) => {
    port.onMessage.addListener(async (msg) => {
        const { apiType, result, params } = msg;

        const mapApiTypeToApi = {
            [INNER_MESSAGING_TYPES.API_REQUEST]: requests,
            [INNER_MESSAGING_TYPES.TAB_ACTION]: tabs,
        };


        try {
            const response = await mapApiTypeToApi[apiType][result].apply(null, params);

            await port.postMessage({
                result,
                response,
            });
        } catch (error) {
            // Ignore message
        }
    });
};

browser.runtime.onConnect.addListener(onConnected);
