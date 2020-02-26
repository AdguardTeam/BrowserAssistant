import React, { useContext } from 'react';
import './styles/main.pcss';
import { IntlProvider } from 'react-intl';
import { observer } from 'mobx-react';
import manifest from '../../tasks/manifest.common.json';
import rootStore from './stores';
import messagesMap from '../_locales';

const TranslationProvider = observer(({ children }) => {
    const { settingsStore: { locale } } = useContext(rootStore);
    const { default_locale: defaultLocale } = manifest;
    const browserLocale = navigator.language.slice(0, 2);

    const mergedMessages = {
        ...messagesMap[defaultLocale],
        ...messagesMap[locale || browserLocale],
    };

    return (
        <IntlProvider locale={locale || browserLocale} messages={mergedMessages}>
            {children}
        </IntlProvider>
    );
});

export default TranslationProvider;
