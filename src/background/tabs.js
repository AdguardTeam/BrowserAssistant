import browser from 'webextension-polyfill';
import { MessageTypes, RequestTypes } from '../lib/types';
import log from '../lib/logger';

class Tabs {
    async getCurrent() {
        const { id: windowId } = await browser.windows.getCurrent();
        const tabs = await browser.tabs.query({ active: true, windowId });
        return tabs[0];
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
