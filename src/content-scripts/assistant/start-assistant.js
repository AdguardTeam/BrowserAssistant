import browser from 'webextension-polyfill';
import { initAssistant } from './assistant';
import browserApi from '../../background/browserApi';
import { MessageTypes } from '../../lib/types';

export function startAssistant() {
    initAssistant();
    if (window.top !== window || !(document.documentElement instanceof HTMLElement)) {
        return;
    }

    let assistant = global.adguardAssistant();

    browser.runtime.onMessage.addListener((message) => {
        switch (message.type) {
            case MessageTypes.initAssistant: {
                const { options } = message;
                const { addRuleCallbackName } = options;

                if (!assistant) {
                    assistant = global.adguardAssistant();
                } else {
                    assistant.close();
                }

                assistant.start(null, (rules) => {
                    browserApi.runtime.sendMessage({ type: addRuleCallbackName, ruleText: rules });
                });
                break;
            }
            default:
                break;
        }
    });
}
