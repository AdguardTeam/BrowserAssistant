import browser from 'webextension-polyfill';

import log from '../lib/logger';
import messageHandler from './messageHandler';
import state from './state';
import { updateService } from './updateService';
import { consent } from './consent';
import tabs from './tabs';
import browserApi from '../lib/browserApi';

import './icon';

(async () => {
    try {
        browser.runtime.onMessage.addListener(messageHandler);

        updateService.init();
        consent.init();
        state.init();

        if (updateService.isFirstRun && browserApi.utils.isFirefoxBrowser) {
            await tabs.openPostInstallPage();
        }
    } catch (error) {
        log.error(error);
    }
})();
