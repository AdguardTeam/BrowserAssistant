import browser from 'webextension-polyfill';
import log from '../logger';

/**
 * This function moved into separate api file, in order to hide unhandled promise errors
 * @param args
 * @returns {Promise<void>}
 */
// eslint-disable-next-line consistent-return
const sendMessage = async (...args) => {
    try {
        const res = await browser.runtime.sendMessage(...args);
        return res;
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
