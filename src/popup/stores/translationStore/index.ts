/**
 * @file Translation store providing translated messages to the popup.
 */
import { createIntl } from 'react-intl';

import {
    action,
    computed,
    makeObservable,
    observable,
} from 'mobx';
import browser from 'webextension-polyfill';

import messagesMap from '../../../_locales';
import { BASE_LOCALE } from '../../../_locales/langConstants';
import type { RootStore } from '..';

import checkLocale from './checkLocale';

const browserLocale = browser.i18n.getUILanguage();

/**
 * MobX store resolving the UI locale and providing the react-intl instance.
 */
class TranslationStore {
    /**
     * Root store of the popup.
     */
    rootStore: RootStore;

    /**
     * Currently selected locale, or null before initialization.
     */
    locale: string | null = null;

    /**
     * Creates the translation store of the popup.
     * @param rootStore Root store of the popup.
     */
    constructor(rootStore: RootStore) {
        makeObservable(this, {
            locale: observable,
            setLocale: action,
            isReadyToDisplayMessages: computed,
            i18n: computed,
        });
        this.rootStore = rootStore;
    }

    /**
     * Sets the current locale.
     * @param locale Locale to set.
     */
    setLocale = (locale: string): void => {
        this.locale = locale;
        // Reflect the resolved display locale on the document so CSS :lang()
        // selectors (e.g. locale-specific line-breaking rules) match the
        // actually rendered language. Underscores are hyphenated to form a
        // valid BCP 47 tag (e.g. 'zh_cn' -> 'zh-cn').
        const { locale: resolvedLocale } = this.getLocale();
        document.documentElement.setAttribute('lang', resolvedLocale.replace(/_/g, '-'));
    };

    /**
     * Checks whether the locale is already set and messages can be displayed.
     * @returns True if the locale is set.
     */
    get isReadyToDisplayMessages(): boolean {
        return !!this.locale;
    }

    /**
     * Returns locale in the next order
     * 1. Returns application locale if has translations
     * 2. Returns browser locale if has translations
     * 3. Returns base locale.
     * @returns The locale to display messages in.
     */
    getLocale = (): { locale: string } => {
        let result = checkLocale(messagesMap, this.locale);

        if (result.suitable) {
            return { locale: result.locale };
        }

        result = checkLocale(messagesMap, browserLocale);
        return result.suitable ? { locale: result.locale } : { locale: BASE_LOCALE };
    };

    /**
     * Returns the react-intl instance for the current locale.
     * @returns The react-intl instance.
     */
    get i18n() {
        const result = this.getLocale();

        const defaultMessages = messagesMap[BASE_LOCALE];
        const currentLocaleMessages = messagesMap[result.locale];

        // messages with fallback to base locale
        const messages = Object.keys(defaultMessages).reduce((acc: Record<string, string>, key) => {
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

    /**
     * Translates the message with the given id for the current locale.
     * @param id Message id to translate.
     * @returns The translated message.
     */
    translate = (id: string): string => this.i18n.formatMessage({ id });
}

export default TranslationStore;
