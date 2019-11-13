import browser from 'webextension-polyfill';
import log from '../../lib/logger';

/**
 * This function moved into separate api file, in order to hide unhandled promise errors
 * @param args
 * @returns {Promise<void>}
 */
const sendMessage = async (...args) => {
    try {
        await browser.runtime.sendMessage(...args);
    } catch (e) {
        log.warn(e.message);
    }
};

export default {
    sendMessage,
};
