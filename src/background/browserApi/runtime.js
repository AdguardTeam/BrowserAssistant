import browser from 'webextension-polyfill';
import log from '../../lib/logger';

/**
 * This function moved into separate api file, in order to hide unhandled promise errors
 * @param args
 * @returns {Promise<void>}
 */
const sendMessage = (...args) => browser.runtime.sendMessage(...args).catch((error) => {
    if (!browser.runtime.lastError) {
        log.error(error.message);
    }
});

export const getUrl = (url) => browser.runtime.getURL(url);

export default {
    sendMessage,
};
