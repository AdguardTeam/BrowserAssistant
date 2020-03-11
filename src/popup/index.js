import React from 'react';
import ReactDOM from 'react-dom';
import browser from 'webextension-polyfill';
import { Provider } from 'mobx-react';
import App from './components/App';
import './styles/main.pcss';
import log from '../lib/logger';
import {
    REQUEST_TYPES, TAB_ACTIONS, INNER_MESSAGING_TYPES, API_TYPES,
} from '../lib/types';
import { rootStore } from './stores';

try {
    const {
        settingsStore: {
            setCurrentTabUrlProperties,
            getReferrer,
            setReferrer,
            setProtection,
        },
        requestsStore: {
            getCurrentFilteringState,
        },
    } = rootStore;

    const port = browser.runtime.connect({ name: 'innerMessaging' });

    port.onMessage.addListener(async (msg) => {
        const { actionType, response } = msg;

        switch (actionType) {
            case TAB_ACTIONS.getCurrentTabUrlProperties: {
                setCurrentTabUrlProperties(response);
                await getReferrer();
                await getCurrentFilteringState();
                break;
            }
            case TAB_ACTIONS.getReferrer: {
                await setReferrer(response);
                break;
            }
            case REQUEST_TYPES.reportSite: {
                await adguard.tabs.openPage(response.parameters.reportUrl);

                /** The popup in Firefox is not closed after opening new tabs by Tabs API.
                 *  Reload re-renders popup. */
                window.location.reload();
                break;
            }
            case REQUEST_TYPES.setProtectionStatus: {
                await setProtection(response.appState.isProtectionEnabled);
                await adguard.tabs.updateIconColor(response.appState.isProtectionEnabled);
                break;
            }
            case REQUEST_TYPES.openSettings:
            case REQUEST_TYPES.openFilteringLog: {
                window.close();
                break;
            }
            default: {
                break;
            }
        }
    });

    global.adguard = {};

    const createGlobalActions = (globalVar, actionTypes, apiName, apiType) => {
        // eslint-disable-next-line no-param-reassign
        globalVar[apiName] = {};
        Object.values(actionTypes)
            .forEach((actionType) => {
                // eslint-disable-next-line no-param-reassign
                globalVar[apiName][actionType] = async (...args) => {
                    try {
                        await port.postMessage({
                            apiType,
                            actionType,
                            params: [...args],
                        });
                    } catch (error) {
                        // Ignore message
                    }
                };
            });
    };

    createGlobalActions(adguard, REQUEST_TYPES,
        API_TYPES.requests, INNER_MESSAGING_TYPES.API_REQUEST);
    createGlobalActions(adguard, TAB_ACTIONS,
        API_TYPES.tabs, INNER_MESSAGING_TYPES.TAB_ACTION);

    ReactDOM.render(
        <Provider>
            <App />
        </Provider>,
        document.getElementById('root')
    );
} catch (error) {
    log.error(error);
}
