import browser from 'webextension-polyfill';
import { MessageTypes, RequestTypes } from '../lib/types';

class Tabs {
    constructor() {
        this.isPageChanged = false;
    }

    async getCurrent() {
        const { id: windowId } = await browser.windows.getCurrent();
        const tabs = await browser.tabs.query({ active: true, windowId });
        return tabs[0];
    }

    // eslint-disable-next-line consistent-return
    async sendMessage(type, options) {
        const tab = await this.getCurrent();
        const response = await browser.tabs.sendMessage(tab.id, { type, options });
        if (response) {
            return response;
        }
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
