import browser from 'webextension-polyfill';
import { MessageTypes } from '../lib/types';
import { startAssistant } from './assistant/start-assistant';
import log from '../lib/logger';

try {
    startAssistant();

    // eslint-disable-next-line consistent-return
    browser.runtime.onMessage.addListener((request) => {
        if (request.type === MessageTypes.getReferrer) {
            return Promise.resolve(document.referrer);
        }
    });
} catch (error) {
    log.error(error.message);
}
