import browser from 'webextension-polyfill';
import {
    CONTENT_MESSAGES, MESSAGE_TYPES, REQUEST_TYPES,
} from '../lib/types';
import log from '../lib/logger';
import browserApi from '../lib/browserApi';
import { DOWNLOAD_LINK, CONTENT_SCRIPT_NAME } from '../lib/conts';
import { getFormattedPortByProtocol, getProtocol, getUrlProperties } from '../lib/helpers';

class Tabs {
    isSetupCorrect = true;

    getCurrent = async () => {
        let tab;

        try {
            [tab] = await browser.tabs.query({
                active: true,
                lastFocusedWindow: true,
            });

            if (!tab) {
                // return stub tab
                return {
                    url: 'about:',
                    id: 0,
                };
            }

            if (!(Object.prototype.hasOwnProperty.call(tab, 'url'))) {
                log.error('Browser tabs api error: no url property in the current tab. Checkout tabs permission in the manifest', tab);

                this.isSetupCorrect = false;

                await browserApi.runtime.sendMessage(
                    { result: MESSAGE_TYPES.SHOW_SETUP_INCORRECT }
                );
            }
        } catch (error) {
            log.error(error);
        }
        return tab;
    };

    sendMessage = async (type, params) => {
        const tab = await this.getCurrent();
        let response;
        try {
            response = await browser.tabs.sendMessage(tab.id, {
                type,
                params,
            });
        } catch (error) {
            // Ignore message
        }
        return response;
    };

    // eslint-disable-next-line consistent-return
    getReferrer = async () => {
        const tab = await this.getCurrent();
        const response = await this.sendMessage(tab.id, { type: CONTENT_MESSAGES.getReferrer });
        if (response) {
            return Promise.resolve(response);
        }
    };

    initAssistant = async () => {
        const tab = await this.getCurrent();
        await browser.tabs.executeScript(tab.id, { file: CONTENT_SCRIPT_NAME });
        const params = { addRuleCallbackName: REQUEST_TYPES.addRule };
        this.sendMessage(CONTENT_MESSAGES.initAssistant, params);
    };

    openPage = (url = DOWNLOAD_LINK) => {
        browser.tabs.create({ url });
    };

    getCurrentTabUrlProperties = async () => {
        const tab = await this.getCurrent();
        const currentURL = tab.url || tab.pendingUrl;

        const { hostname, port, protocol } = getUrlProperties(currentURL);

        const currentProtocol = getProtocol(protocol);
        const currentPort = getFormattedPortByProtocol(port, currentProtocol);

        return {
            currentURL,
            currentPort,
            currentProtocol,
            hostname,
        };
    };

    reload = async () => {
        try {
            const tab = await this.getCurrent();
            await browser.tabs.reload(tab.id);
        } catch (error) {
            log.error(error);
        }
    };
}

const tabs = new Tabs();

export default tabs;
