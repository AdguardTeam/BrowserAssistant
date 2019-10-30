import browser from 'webextension-polyfill';

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'getReferrer') {
        sendResponse(document.referrer);
    }
});
