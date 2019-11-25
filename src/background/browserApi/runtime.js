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
    } catch (err) {
        if (err.message === 'Could not establish connection. Receiving end does not exist.') {
            log.warn('Webextension-polyfill internal resources exchange warning:', err.message);
        } else {
            log.error(err.message);
        }
    }
};

export default {
    sendMessage,
};
