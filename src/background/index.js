import browser from 'webextension-polyfill';

import log from '../lib/logger';
import { messageHandler } from './messageHandler';
import { longLivedMessageService } from './longLivedMessageService';
import state from './state';
import { updateService } from './updateService';
import { migrationService } from './migrationService';
import { consent } from './consent';
import { tabs } from '../lib/tabs';
import { browserApi } from '../lib/browserApi';
import { settings } from './settings';
import { ContextMenu } from './contextMenu';

import './icon';

// add listener on the upper level
browser.runtime.onMessage.addListener(messageHandler);
browser.runtime.onConnect.addListener(longLivedMessageService.init);

const onInstalled = async (runInfo) => {
    if (runInfo.isUpdate) {
        await migrationService.migrate(runInfo.previousVersion);
    }

    if (runInfo.isFirstRun) {
        await consent.setConsentRequired(true);
    }

    const isConsentRequired = await consent.isConsentRequired();

    if (isConsentRequired && browserApi.utils.isFirefoxBrowser) {
        await tabs.openPostInstallPage();
    }
};

(async () => {
    try {
        await settings.init();
        await updateService.init(onInstalled);
        state.init();
        ContextMenu.init();
    } catch (error) {
        log.error(error);
    }
})();
