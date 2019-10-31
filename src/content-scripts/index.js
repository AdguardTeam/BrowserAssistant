import browser from 'webextension-polyfill';
import { ContentScriptRequestsTypes } from '../lib/types';
import { startAssistant } from './assistant/start-assistant';

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(request, sender, sendResponse);
    if (request.type === ContentScriptRequestsTypes.getReferrer) {
        sendResponse(document.referrer);
    }
    // TODO: повесить addRule на кнопку с id = adg-accept
    if (request.type === ContentScriptRequestsTypes.initAssistant) {
        startAssistant();
        sendResponse(document.referrer);
    }
});
