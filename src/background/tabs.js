import browser from 'webextension-polyfill';

class Tabs {
    async getCurrent() {
        const { id: windowId } = await browser.windows.getCurrent();
        const tabs = await browser.tabs.query({ active: true, windowId });
        return tabs[0];
    }


    // TODO: refactor like in referrer
    async getReferrer() {
        browser.runtime.sendMessage({ type: 'getReferrer' });
    }
}

const tabs = new Tabs();

export default tabs;
