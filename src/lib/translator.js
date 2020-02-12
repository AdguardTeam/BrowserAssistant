import browser from 'webextension-polyfill';
import log from './logger';

const translate = (key) => {
    try {
        return browser.i18n.getMessage(key);
    } catch (error) {
        log.error(error);
        return key;
    }
};

const translator = {
    translate,
};

export default translator;
