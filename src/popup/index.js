import React from 'react';
import ReactDOM from 'react-dom';
import browser from 'webextension-polyfill';
import { Provider } from 'mobx-react';
import { IntlProvider } from 'react-intl';
import App from './components/App';
import './styles/main.pcss';
import log from '../lib/logger';
import manifest from '../../tasks/manifest.common.json';
import messagesMap from '../_locales';

const { default_locale: defaultLocale } = manifest;
const locale = navigator.language.slice(0, 2) || defaultLocale;
const mergedMessages = { ...messagesMap[defaultLocale], ...messagesMap[locale] };

try {
    (async () => {
        const bgPage = await browser.runtime.getBackgroundPage();
        global.adguard = bgPage.adguard;
        ReactDOM.render(
            <IntlProvider locale={locale} messages={mergedMessages}>
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
