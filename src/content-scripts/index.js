import browser from 'webextension-polyfill';
import { CONTENT_MESSAGES } from '../lib/types';
import { startAssistant } from './start-assistant';
import log from '../lib/logger';
import { browserApi } from '../lib/browserApi';

const initialize = () => {
    // Prevent running content script more than once
    if (window.___agcs_run) {
        return;
    }

    browser.runtime.onMessage.addListener((message) => {
        const { type, data } = message;
        switch (type) {
            case CONTENT_MESSAGES.GET_REFERRER:
                return Promise.resolve(document.referrer);
            case CONTENT_MESSAGES.INIT_ASSISTANT: {
                const { addRuleCallbackName } = data;
                startAssistant(async (ruleText) => {
                    await browserApi.runtime.sendMessage({
                        type: addRuleCallbackName,
                        data: { ruleText },
                    });
                });
                return Promise.resolve();
            }
            default:
                break;
        }
        return Promise.resolve();
    });

    window.___agcs_run = true;
};

try {
    initialize();
} catch (error) {
    log.error(error);
}
