import { action, computed, observable } from 'mobx';
import { createIntl } from 'react-intl';
import { browserLocale } from '../../../lib/conts';
import messagesMap from '../../../_locales';
import manifest from '../../../../tasks/manifest.common.json';

const { default_locale: defaultLocale } = manifest;

class TranslationsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable locale = defaultLocale;

    @action
    setLocale = (locale) => {
        this.locale = locale;
    };

    @computed
    get i18n() {
        const fallbackLocale = messagesMap[browserLocale] ? browserLocale : defaultLocale;
        const locale = messagesMap[this.locale] ? this.locale : fallbackLocale;

        const messages = {
            ...messagesMap[defaultLocale],
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
