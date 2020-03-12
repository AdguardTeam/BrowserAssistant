import browser from 'webextension-polyfill';
import log from '../logger';

/**
 * This function moved into separate api file, in order to hide unhandled promise errors
 * @param args
 * @returns {Promise<void>}
 */
const sendMessage = async (...args) => {
    try {
        await browser.runtime.sendMessage(...args);
    } catch (error) {
        if (!browser.runtime.lastError) {
            log.error(error);
        }
    }
};

export const getUrl = (url) => browser.runtime.getURL(url);

export default {
    sendMessage,
};
