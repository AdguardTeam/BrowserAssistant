import browser from 'webextension-polyfill';
import { ContentScriptRequestsTypes } from '../background/types';

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === ContentScriptRequestsTypes.getReferrer) {
        sendResponse(document.referrer);
    }
});
