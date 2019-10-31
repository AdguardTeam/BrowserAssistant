import browser from 'webextension-polyfill';
import { ContentScriptRequestsTypes } from './types';

class Tabs {
    async getCurrent() {
        const { id: windowId } = await browser.windows.getCurrent();
        const tabs = await browser.tabs.query({ active: true, windowId });
        return tabs[0];
    }

    async getReferrer() {
        const tab = await this.getCurrent();
        let response;
        try {
            response = await browser.tabs.sendMessage(tab.id,
                { type: ContentScriptRequestsTypes.getReferrer });
            if (response) {
                return response;
            }
        } catch (error) {
            console.error(error.message);
        }
        return 'no response';
    }
}

const tabs = new Tabs();

export default tabs;
