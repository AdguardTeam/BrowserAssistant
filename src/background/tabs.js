import browser from 'webextension-polyfill';
import { ContentScriptRequestsTypes } from '../lib/types';

class Tabs {
    async getCurrent() {
        const { id: windowId } = await browser.windows.getCurrent();
        const tabs = await browser.tabs.query({ active: true, windowId });
        return tabs[0];
    }

    async sendRequest(type) {
        const tab = await this.getCurrent();
        let response;
        try {
            response = await browser.tabs.sendMessage(tab.id, { type });
            if (response) {
                return response;
            }
        } catch (error) {
            console.error(error.message);
        }
        return 'no response';
    }

    async getReferrer() {
        this.sendRequest(ContentScriptRequestsTypes.getReferrer);
    }

    async initAssistant() {
        this.sendRequest(ContentScriptRequestsTypes.initAssistant);
    }
}

const tabs = new Tabs();

export default tabs;
