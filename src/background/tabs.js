import browser from 'webextension-polyfill';
import { MessageTypes, RequestTypes } from '../lib/types';

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
        } catch (error) {
            console.error(error.message);
        }
        return '';
    }

    async getReferrer() {
        const referrer = await this.sendMessage(MessageTypes.getReferrer);
        return referrer;
    }

    async initAssistant() {
        const options = { addRuleCallbackName: RequestTypes.addRule };
        this.sendMessage(MessageTypes.initAssistant, options);
    }
}

const tabs = new Tabs();

export default tabs;
