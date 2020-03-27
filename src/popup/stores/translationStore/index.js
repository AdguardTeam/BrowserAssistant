import { action, computed, observable } from 'mobx';
import { createIntl } from 'react-intl';
import messagesMap from '../../../_locales';
import checkLocale from './checkLocale';

const { BASE_LOCALE } = require('../../../../tasks/langConstants');

const browserLocale = navigator.language;

class TranslationStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable locale = null;

    @action
    setLocale = (locale) => {
        this.locale = locale;
    };

    /**
     * Returns locale in the next order
     * 1. Returns application locale if has translations
     * 2. Returns browser locale if has translations
     * 3. Returns base locale
     * @returns {string} locale
     */
    getLocale = () => {
        let result = checkLocale(messagesMap, this.locale);
        if (result.suitable) {
            return result.locale;
        }
        result = checkLocale(messagesMap, browserLocale);
        return result.suitable ? result.locale : BASE_LOCALE;
    };

    @computed
    get i18n() {
        let locale = this.getLocale();

        const messages = messagesMap[locale];

        // createIntl doesnt accepts locales codes longer than 2 chars
        // and here it is not important, so we left only two chars
        locale = locale.slice(0, 2);
        return createIntl({
            locale,
            messages,
        });
    }

    translate = (id) => this.i18n.formatMessage({ id });
}

export default TranslationStore;
