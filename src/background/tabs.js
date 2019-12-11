import browser from 'webextension-polyfill';
import { BACKGROUND_COMMANDS, MessageTypes, RequestTypes } from '../lib/types';
import log from '../lib/logger';
import browserApi from './browserApi';

class Tabs {
    async getCurrent() {
        const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
        if (!tab.url) {
            log.error('Browser tabs api error: no url property. Checkout activeTab permission in manifest.', tab);
            browserApi.runtime.sendMessage({ result: BACKGROUND_COMMANDS.SHOW_RELOAD });
            setTimeout(() => browserApi.runtime.sendMessage(
                { result: BACKGROUND_COMMANDS.CLOSE_POPUP }
            ),
            1000);
        }
        return tab;
    }

    async sendMessage(type, options) {
        const tab = await this.getCurrent();
        let response;
        try {
            response = await browser.tabs.sendMessage(tab.id, { type, options });
            if (response) {
                return response;
            }
        } catch (err) {
            if (err.message === 'Could not establish connection. Receiving end does not exist.') {
                log.warn('Internal messaging error:', err.message);
            } else {
                log.error(err.message);
            }
        }
        return '';
    }

    async getReferrer() {
        return this.sendMessage(MessageTypes.getReferrer);
    }

    async initAssistant() {
        const options = { addRuleCallbackName: RequestTypes.addRule };
        this.sendMessage(MessageTypes.initAssistant, options);
    }

    openDownloadPage() {
        browser.tabs.create({ url: 'https://adguard.com/ru/download.html' });
    }
}

const tabs = new Tabs();

export default tabs;
