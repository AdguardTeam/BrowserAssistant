import browser from 'webextension-polyfill';

/**
 * This function moved into separate api file, in order to hide unhandled promise errors
 * @param args
 * @returns {Promise<void>}
 */
const sendMessage = async (...args) => {
    try {
        await browser.runtime.sendMessage(...args);
    } catch (e) {
        console.error(e.message);
    }
};

export default {
    sendMessage,
};
