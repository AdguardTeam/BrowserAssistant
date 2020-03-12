import browser from 'webextension-polyfill';
import requests from './requestsApi';
import api from './Api';
import { INNER_MESSAGE_TYPES } from '../lib/types';
import tabs from './tabs';
import log from '../lib/logger';
import browserApi from '../lib/browserApi';

const messageHandlers = {
    ...tabs,
    ...requests,
};

const handleMessage = async (msg) => {
    const { type, params } = msg;
    if (!Object.prototype.hasOwnProperty.call(INNER_MESSAGE_TYPES, type)) {
        log.warn('Inner messaging type "%s" is not the message handler', type);
        return;
    }
    try {
        const responseParams = await messageHandlers[type](params);
        await browserApi.runtime.sendMessage({
            type,
            params: responseParams,
        });
    } catch (error) {
        // Ignore message
    }
};

try {
    api.init();

    browser.runtime.onMessage.addListener(handleMessage);
    browser.tabs.onActivated.addListener(tabs.updateIconColorListener);
    browser.tabs.onUpdated.addListener(tabs.updateIconColorReloadListener);
} catch (error) {
    log.error(error);
}
