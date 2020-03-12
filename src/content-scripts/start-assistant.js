import 'adguard-assistant';
import browser from 'webextension-polyfill';
import browserApi from '../lib/browserApi';
import { CONTENT_MESSAGES } from '../lib/types';

export function startAssistant() {
    if (window.top !== window || !(document.documentElement instanceof HTMLElement)) {
        return;
    }

    let assistant = global.adguardAssistant();

    browser.runtime.onMessage.addListener((msg) => {
        if (msg.type === CONTENT_MESSAGES.initAssistant) {
            const { addRuleCallbackName } = msg.params;

            if (!assistant) {
                assistant = global.adguardAssistant();
            } else {
                assistant.close();
            }

            assistant.start(null, (ruleText) => {
                browserApi.runtime.sendMessage({ type: addRuleCallbackName, params: { ruleText } });
            });
        }
    });
}
