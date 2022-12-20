import {
    action,
    computed,
    makeObservable,
    observable,
} from 'mobx';
import { createIntl } from 'react-intl';
import browser from 'webextension-polyfill';

import messagesMap from '../../../_locales';
import checkLocale from './checkLocale';

const { BASE_LOCALE } = require('../../../_locales/langConstants');

const browserLocale = browser.i18n.getUILanguage();

class TranslationStore {
    constructor(rootStore) {
        makeObservable(this);
        this.rootStore = rootStore;
    }

    @observable locale = null;

    @action
    setLocale = (locale) => {
        this.locale = locale;
    };

    @computed
    get isReadyToDisplayMessages() {
        return !!this.locale;
    }

    /**
     * Returns locale in the next order
     * 1. Returns application locale if has translations
     * 2. Returns browser locale if has translations
     * 3. Returns base locale
     * @returns {{locale: string}} locale
     */
    getLocale = () => {
        let result = checkLocale(messagesMap, this.locale);

        if (result.suitable) {
            return { locale: result.locale };
        }

        result = checkLocale(messagesMap, browserLocale);
        return result.suitable ? { locale: result.locale } : { locale: BASE_LOCALE };
    };

    @computed
    get i18n() {
        const result = this.getLocale();

        const defaultMessages = messagesMap[BASE_LOCALE];
        const currentLocaleMessages = messagesMap[result.locale];

        // messages with fallback to base locale
        const messages = Object.keys(defaultMessages).reduce((acc, key) => {
            acc[key] = currentLocaleMessages?.[key] || defaultMessages[key];
            return acc;
        }, {});

        // createIntl doesn't accept locales codes longer than 2 chars
        // and here it is not important, so we left only two chars
        const locale = result.locale.slice(0, 2);
        return createIntl({
            locale,
            messages,
        });
    }

    translate = (id) => this.i18n.formatMessage({ id });
}

export default TranslationStore;
