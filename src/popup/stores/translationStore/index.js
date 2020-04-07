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

    @computed
    get isReadyToDisplayMessages() {
        return !!this.locale;
    }

    /**
     * Returns locale in the next order
     * 1. Returns application locale if has translations
     * 2. Returns browser locale if has translations
     * 3. Returns base locale
     * @returns {{locale: string, originalKey: string}} locale
     */
    getLocale = () => {
        let result = checkLocale(messagesMap, this.locale);

        if (result.suitable) {
            return { locale: result.locale, originalKey: result.originalKey, };
        }

        result = checkLocale(messagesMap, browserLocale);
        return result.suitable
            ? { locale: result.locale, originalKey: result.originalKey }
            : BASE_LOCALE;
    };

    @computed
    get i18n() {
        const result = this.getLocale();

        const messages = messagesMap[result.originalKey];

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
