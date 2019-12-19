import browser from 'webextension-polyfill';
import { MessageTypes } from '../lib/types';
import { startAssistant } from './assistant/start-assistant';
import log from '../lib/logger';

try {
    startAssistant();

    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.type === MessageTypes.getReferrer) {
            sendResponse(document.referrer);
        }
    });
} catch (error) {
    log.error(error.message);
}
