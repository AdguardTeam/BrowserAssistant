import { action, computed, observable } from 'mobx';
import { createIntl } from 'react-intl';
import browser from 'webextension-polyfill';
import messagesMap from '../../../_locales';
import checkLocale from './checkLocale';

const { BASE_LOCALE } = require('../../../../tasks/translations/langConstants');

const browserLocale = browser.i18n.getUILanguage();

class TranslationStore {
    constructor(rootStore) {
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
     * @returns {{locale: string, matchedKey: string}} locale
     */
    getLocale = () => {
        let result = checkLocale(messagesMap, this.locale);

        if (result.suitable) {
            return { locale: result.locale, matchedKey: result.matchedKey };
        }

        result = checkLocale(messagesMap, browserLocale);
        return result.suitable
            ? { locale: result.locale, matchedKey: result.matchedKey }
            : { locale: BASE_LOCALE, matchedKey: BASE_LOCALE };
    };

    @computed
    get i18n() {
        const result = this.getLocale();

        const messages = messagesMap[result.matchedKey];

        // createIntl doesnt accepts locales codes longer than 2 chars
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
