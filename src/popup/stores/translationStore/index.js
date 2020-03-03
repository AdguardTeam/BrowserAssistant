import { action, computed, observable } from 'mobx';
import { createIntl } from 'react-intl';
import { browserLocale } from '../../../lib/conts';
import messagesMap from '../../../_locales';

const { BASE_LOCALES } = require('../../../../tasks/consts');

class TranslationsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable locale = BASE_LOCALES;

    @action
    setLocale = (locale) => {
        this.locale = locale;
    };

    @computed
    get i18n() {
        const fallbackLocale = messagesMap[browserLocale] ? browserLocale : BASE_LOCALES;
        const locale = messagesMap[this.locale] ? this.locale : fallbackLocale;

        const messages = {
            ...messagesMap[BASE_LOCALES],
            ...messagesMap[locale],
        };

        return createIntl({
            locale,
            messages,
        });
    }

    translate = (id) => this.i18n.formatMessage({ id });
}

export default TranslationsStore;
