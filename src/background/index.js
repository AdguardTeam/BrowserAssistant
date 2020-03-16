import browser from 'webextension-polyfill';
import api from './Api';
import log from '../lib/logger';
import icon from './icon';
import messageHandler from './messageHandler';

try {
    api.init();

    browser.runtime.onMessage.addListener(messageHandler);
    browser.tabs.onActivated.addListener(icon.updateIconColorListener);
    browser.tabs.onUpdated.addListener(icon.updateIconColorReloadListener);
} catch (error) {
    log.error(error);
}
