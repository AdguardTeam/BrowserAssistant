import browser from 'webextension-polyfill';
import {
    BACKGROUND_COMMANDS, CONTENT_MESSAGES, REQUEST_TYPES, SETUP_STATES,
} from '../lib/types';
import log from '../lib/logger';
import browserApi from '../lib/browserApi';
import { DOWNLOAD_LINK, CONTENT_SCRIPT_NAME } from '../lib/conts';
import requests from './requestsApi';
import actions from './actions';
import { getFormattedPortByProtocol, getProtocol, getUrlProperties } from '../lib/helpers';
import Api from './Api';

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
                    { result: BACKGROUND_COMMANDS.SHOW_SETUP_INCORRECT }
                );
            }
            await browser.storage.local.set(
                { [SETUP_STATES.isSetupCorrect]: this.isSetupCorrect }
            );
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

    getIsAppWorking = async () => {
        const {
            currentURL: url, currentPort: port,
        } = await this.getCurrentTabUrlProperties();
        const response = await requests.getCurrentFilteringState({
            url,
            port,
        });
        const { isFilteringEnabled } = response.parameters;

        const { isInstalled, isRunning, isProtectionEnabled } = response.appState;
        const { isExtensionUpdated } = Api;

        const isAppWorking = [isInstalled, isRunning, isProtectionEnabled,
            isExtensionUpdated, this.isSetupCorrect,
            isFilteringEnabled, isFilteringEnabled]
            .every((state) => state === true);

        return isAppWorking;
    };

    updateIconColor = async (isAppWorking, tabId) => {
        try {
            let id = tabId;
            if (!tabId) {
                const tab = await this.getCurrent();
                id = tab && tab.id;
            }

            if (id) {
                if (isAppWorking) {
                    await actions.setIconEnabled(id);
                } else {
                    await actions.setIconDisabled(id);
                }
            }
        } catch (error) {
            // Ignore message
        }
    };

    updateIconColorListener = async ({ tabId }) => {
        const isAppWorking = await this.getIsAppWorking();

        this.updateIconColor(isAppWorking, tabId);
    };

    updateIconColorReloadListener = async (tabId, changeInfo) => {
        if (changeInfo.status === 'loading') {
            this.updateIconColorListener({ tabId });
        }
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
