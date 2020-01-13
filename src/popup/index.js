import React from 'react';
import ReactDOM from 'react-dom';
import browser from 'webextension-polyfill';
import { Provider } from 'mobx-react';
import { IntlProvider } from 'react-intl';
import App from './components/App';
import './styles/main.pcss';
import log from '../lib/logger';
import messages from '../_locales/en';

try {
    (async () => {
        const bgPage = await browser.runtime.getBackgroundPage();
        global.adguard = bgPage.adguard;
        ReactDOM.render(
            <IntlProvider locale={navigator.language} messages={messages}>
                <Provider>
                    <App />
                </Provider>
            </IntlProvider>,
            document.getElementById('root')
        );
    })();
} catch (error) {
    log.error(error.message);
}
