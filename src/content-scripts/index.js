import browser from 'webextension-polyfill';
import { CONTENT_MESSAGES } from '../lib/types';
import { startAssistant } from './start-assistant';
import log from '../lib/logger';
import browserApi from '../lib/browserApi';

const initialize = () => {
    if (Window.prototype.___agcs_run) {
        return;
    }

    browser.runtime.onMessage.addListener((message) => {
        switch (message.type) {
            case CONTENT_MESSAGES.getReferrer:
                return Promise.resolve(document.referrer);
            case CONTENT_MESSAGES.initAssistant: {
                const { addRuleCallbackName } = message.params;
                startAssistant(async (ruleText) => {
                    await browserApi.runtime.sendMessage({
                        type: addRuleCallbackName,
                        params: { ruleText },
                    });
                });
                return Promise.resolve();
            }
            default:
                break;
        }
        return Promise.resolve();
    });

    Window.prototype.___agcs_run = true;
};

try {
    initialize();
} catch (error) {
    log.error(error);
}
