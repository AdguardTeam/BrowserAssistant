import browser from 'webextension-polyfill';
import { CONTENT_MESSAGES } from '../lib/types';
import { startAssistant } from './start-assistant';
import log from '../lib/logger';

try {
    startAssistant();

    // eslint-disable-next-line consistent-return
    browser.runtime.onMessage.addListener((msg) => {
        if (msg.type === CONTENT_MESSAGES.getReferrer) {
            return Promise.resolve(document.referrer);
        }
    });
} catch (error) {
    log.error(error);
}
