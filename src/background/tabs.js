import browser from 'webextension-polyfill';
import { BACKGROUND_COMMANDS, MessageTypes, RequestTypes } from '../lib/types';
import log from '../lib/logger';
import browserApi from './browserApi';
import { DOWNLOAD_LINK, CONTENT_SCRIPT_NAME, ICON_COLORS } from '../lib/conts';
import requests from './requestsApi';
import { getFormattedPortByProtocol, getProtocol, getUrlProperties } from '../lib/helpers';
import { ORIGINAL_CERT_STATUS, PROTOCOLS } from '../popup/stores/consts';
import api from './Api';

class Tabs {
    isSetupCorrectly = true;

    getCurrent = async () => {
        const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true });
        if (!tab.url) {
            log.error('Browser tabs api error: no url property in the current tab. Checkout tabs permission in the manifest.', tab);
            this.isSetupCorrectly = false;
            await browserApi.runtime.sendMessage({ result: BACKGROUND_COMMANDS.SHOW_RELOAD });
            setTimeout(() => browserApi.runtime.sendMessage(
                { result: BACKGROUND_COMMANDS.SHOW_SETUP_INCORRECTLY }
            ),
            1000);
        }
        return tab;
    };

    sendMessage = async (type, options) => {
        const tab = await this.getCurrent();
        return browser.tabs.sendMessage(tab.id, { type, options }).catch((error) => {
            if (!browser.runtime.lastError) {
                log.error(error.message);
            }
        });
    };

    getReferrer = async () => {
        return this.sendMessage(MessageTypes.getReferrer);
    };

    initAssistant = async () => {
        const tab = await this.getCurrent();
        await browser.tabs.executeScript(tab.id, { file: CONTENT_SCRIPT_NAME });
        const options = { addRuleCallbackName: RequestTypes.addRule };
        this.sendMessage(MessageTypes.initAssistant, options);
    };

    openDownloadPage = () => {
        browser.tabs.create({ url: DOWNLOAD_LINK });
    };

    setIconColor = async (color = ICON_COLORS.GREEN, tabId) => {
        // eslint-disable-next-line no-param-reassign
        tabId = tabId || (await this.getCurrent()).id;
        return browser.browserAction.setIcon(
            {
                path: {
                    19: `assets/images/assistant-logo--19--${color}.png`,
                    38: `assets/images/assistant-logo--38--${color}.png`,
                },
                tabId,
            }
        );
    };

    getCurrentTabUrlProperties = async () => {
        const tab = await this.getCurrent();
        const { url } = tab;

        const { hostname, port, protocol } = getUrlProperties(url);

        const currentProtocol = getProtocol(protocol);
        const currentPort = getFormattedPortByProtocol(port, currentProtocol);

        return {
            currentURL: url,
            currentPort,
            currentProtocol,
            hostname,
        };
    };

    getStatus = async () => {
        const {
            currentURL,
            currentPort,
            currentProtocol,
        } = await this.getCurrentTabUrlProperties();

        const response = await requests.getCurrentFilteringState(currentURL, currentPort);
        const { originalCertStatus, isFilteringEnabled } = response.parameters;

        const { isInstalled, isRunning, isProtectionEnabled } = response.appState;
        const appState = {
            isInstalled,
            isRunning,
            isProtectionEnabled,
        };

        return {
            appState,
            originalCertStatus,
            isFilteringEnabled,
            currentProtocol,
        };
    };

    updateIconColor = async () => {
        const { id } = await this.getCurrent();
        const {
            appState,
            originalCertStatus,
            isFilteringEnabled,
            currentProtocol,
        } = await this.getStatus();

        const states = Object.values(appState);
        states.push(this.isSetupCorrectly, api.isAppUpToDate, api.isExtensionUpdated);

        if (!states.every(Boolean) || originalCertStatus !== ORIGINAL_CERT_STATUS.VALID) {
            return this.setIconColor(ICON_COLORS.ORANGE, id);
        }
        if (currentProtocol === PROTOCOLS.SECURED) {
            return this.setIconColor(ICON_COLORS.GREEN, id);
        }
        if (!isFilteringEnabled) {
            return this.setIconColor(ICON_COLORS.GRAY, id);
        }
        return this.setIconColor(ICON_COLORS.GREEN, id);
    };
}

const tabs = new Tabs();

export default tabs;
