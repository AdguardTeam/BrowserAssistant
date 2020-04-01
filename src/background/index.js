import browser from 'webextension-polyfill';
import log from '../lib/logger';
import messageHandler from './messageHandler';
import state from './State';
import './icon';

try {
    state.init();
    browser.runtime.onMessage.addListener(messageHandler);
} catch (error) {
    log.error(error);
}
