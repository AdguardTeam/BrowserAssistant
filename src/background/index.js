import browser from 'webextension-polyfill';
import requests from './requestsApi';
import tabs from './tabs';

// TODO: make webpack load adguard api
// TODO: content script should load document.referrer
requests.init();
browser.runtime.onMessage.addListener((sender, data) => {
    console.log('onMessage', sender, data);
    if (sender.type === 'referrer') {
        browser.runtime.sendMessage(data);
    }
});

global.adguard = {
    requests,
    tabs,
};
