import { action, computed, observable } from 'mobx';
import { createIntl } from 'react-intl';
import { browserLocale } from '../../../lib/conts';
import messagesMap from '../../../_locales';
import twoskyConfig from '../../../../.twosky.json';

const [{ base_locale: baseLocale }] = twoskyConfig;

class TranslationsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable locale = baseLocale;

    @action
    setLocale = (locale) => {
        this.locale = locale;
    };

    @computed
    get i18n() {
        const fallbackLocale = messagesMap[browserLocale] ? browserLocale : baseLocale;
        const locale = messagesMap[this.locale] ? this.locale : fallbackLocale;

        const messages = {
            ...messagesMap[baseLocale],
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
