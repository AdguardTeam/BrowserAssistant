/* global, adguardAssistant */

import browser from 'webextension-polyfill';
import { initAssistant } from './assistant';
import browserApi from '../../background/browserApi/browserApiIndex';

export function startAssistant() {
    initAssistant();
    if (window.top !== window || !(document.documentElement instanceof HTMLElement)) {
        return;
    }

    let assistant;

    // save right-clicked element for assistant
    let clickedEl = null;
    document.addEventListener('mousedown', (event) => {
        if (event.button === 2) {
            clickedEl = event.target;
        }
    });
    assistant = adguardAssistant();

    browser.runtime.onMessage.addListener((message) => {
        switch (message.type) {
            case 'initAssistant': {
                const { options } = message;
                const { addRuleCallbackName } = options;
                let selectedElement = null;
                if (clickedEl && options.selectElement) {
                    selectedElement = clickedEl;
                }

                if (!assistant) {
                    assistant = adguardAssistant();
                } else {
                    assistant.close();
                }

                assistant.start(selectedElement, (rules) => {
                    browserApi.runtime.sendMessage({ type: addRuleCallbackName, ruleText: rules });
                });
                break;
            }
            default:
                break;
        }
    });
}
