import { CONTENT_MESSAGES } from '../lib/types';
import browser from 'webextension-polyfill';

/**
 * TODO: Temporary hack for keeping alive service worker
 *  via sending messages to the service worker
 */
export const keepAwake = () => {
    const MESSAGE_SEND_INTERVAL_MS = 10000;

    if (window.top === window && (document.documentElement instanceof HTMLElement)) {
        setInterval(async () => {
            try {
                await browser.runtime.sendMessage({ type: CONTENT_MESSAGES.PING });
            } catch (e) {}
        }, MESSAGE_SEND_INTERVAL_MS);
    }
};
