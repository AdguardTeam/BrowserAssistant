import React from 'react';
import ReactDOM from 'react-dom';
import browser from 'webextension-polyfill';
import { Provider } from 'mobx-react';
import { IntlProvider } from 'react-intl';
import App from './components/App';
import './styles/main.pcss';
import log from '../lib/logger';
import manifest from '../../tasks/manifest.common.json';
import ru from '../_locales/ru/messages.json';
import en from '../_locales/en/messages.json';

const flat = (lang) => Object.fromEntries(
    Object.entries(lang).map(([key, value]) => [key, value.message])
);

const messagesEn = flat(en);
const messagesRu = flat(ru);

const messagesMap = {
    en: messagesEn,
    ru: messagesRu,
};

const locale = manifest.default_locale;

try {
    (async () => {
        const bgPage = await browser.runtime.getBackgroundPage();
        global.adguard = bgPage.adguard;
        ReactDOM.render(
            <IntlProvider locale={locale} messages={messagesMap[locale]}>
                <Provider>
                    <App />
                </Provider>
            </IntlProvider>,
            document.getElementById('root')
        );
    })();
} catch (error) {
    log.error(error);
}
