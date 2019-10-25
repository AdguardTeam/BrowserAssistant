import React from 'react';
import ReactDOM from 'react-dom';
import browser from 'webextension-polyfill';
import App from './components/App';
import './styles/main.pcss';

(async () => {
    const bgPage = await browser.runtime.getBackgroundPage();
    global.adguard = bgPage.adguard;
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    );
})();
