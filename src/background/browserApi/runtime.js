import browser from 'webextension-polyfill';
import log from '../../lib/logger';

/**
 * This function moved into separate api file, in order to hide unhandled promise errors
 * @param args
 * @returns {Promise<void>}
 */
const sendMessage = (...args) => browser.runtime.sendMessage(...args).catch((err) => {
    if (!browser.runtime.lastError) {
        log.error(err.message);
    }
});

export default {
    sendMessage,
};
