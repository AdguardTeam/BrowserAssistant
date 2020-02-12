import browser from 'webextension-polyfill';
import { BACKGROUND_COMMANDS, MessageTypes, RequestTypes } from '../lib/types';
import log from '../lib/logger';
import browserApi from './browserApi';
import { DOWNLOAD_LINK, CONTENT_SCRIPT_NAME } from '../lib/conts';


class Tabs {
    async getCurrent() {
        const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
        if (!tab.url) {
            log.error('Browser tabs api error: no url property. Checkout activeTab permission in manifest.', tab);
            await browserApi.runtime.sendMessage({ result: BACKGROUND_COMMANDS.SHOW_RELOAD });
            setTimeout(() => browserApi.runtime.sendMessage(
                { result: BACKGROUND_COMMANDS.SHOW_SETUP_INCORRECTLY }
            ),
            1000);
        }
        return tab;
    }

    async sendMessage(type, options) {
        const tab = await this.getCurrent();
        return browser.tabs.sendMessage(tab.id, { type, options }).catch((error) => {
            if (!browser.runtime.lastError) {
                log.error(error);
            }
        });
    }

    async getReferrer() {
        return this.sendMessage(MessageTypes.getReferrer);
    }

    async initAssistant() {
        const tab = await this.getCurrent();
        await browser.tabs.executeScript(tab.id, { file: CONTENT_SCRIPT_NAME });
        const options = { addRuleCallbackName: RequestTypes.addRule };
        this.sendMessage(MessageTypes.initAssistant, options);
    }

    openDownloadPage() {
        browser.tabs.create({ url: DOWNLOAD_LINK });
    }
}

const tabs = new Tabs();

export default tabs;
