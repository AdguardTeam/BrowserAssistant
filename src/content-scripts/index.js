import browser from 'webextension-polyfill';
import { MESSAGE_TYPES } from '../lib/types';
import { startAssistant } from './start-assistant';
import log from '../lib/logger';

try {
    startAssistant();

    // eslint-disable-next-line consistent-return
    browser.runtime.onMessage.addListener((request) => {
        if (request.type === MESSAGE_TYPES.getReferrer) {
            return Promise.resolve(document.referrer);
        }
    });
} catch (error) {
    log.error(error);
}
