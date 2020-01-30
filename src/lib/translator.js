import browser from 'webextension-polyfill';
import log from './logger';

const translate = (key) => {
    let message;
    try {
        message = browser.i18n.getMessage(key);
    } catch (error) {
        log.error(error);
    }
    return message;
};

const translator = {
    translate,
};

export default translator;
