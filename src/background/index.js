import browser from 'webextension-polyfill';

import log from '../lib/logger';
import messageHandler from './messageHandler';
import state from './state';
import { updateService } from './updateService';
import { consent } from './consent';
import tabs from './tabs';
import browserApi from '../lib/browserApi';

import './icon';

// add listener on the upper level
browser.runtime.onMessage.addListener(messageHandler);

const onInstalled = async (runInfo) => {
    if (runInfo.isFirstRun) {
        consent.setConsentRequired(true);
    }

    if (consent.isConsentRequired() && browserApi.utils.isFirefoxBrowser) {
        await tabs.openPostInstallPage();
    }
};

(async () => {
    try {
        updateService.init(onInstalled);
        state.init();
    } catch (error) {
        log.error(error);
    }
})();
