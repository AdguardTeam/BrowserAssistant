import React from 'react';
import ReactDOM from 'react-dom';
import browser from 'webextension-polyfill';
import { Provider } from 'mobx-react';
import App from './components/App';
import './styles/main.pcss';
import log from '../lib/logger';
import {
    RequestTypes, TabActions, INNER_MESSAGING_TYPES, apiTypes,
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
            case TabActions.getCurrentTabUrlProperties: {
                setCurrentTabUrlProperties(response);
                await getReferrer();
                await getCurrentFilteringState();
                break;
            }
            case TabActions.getReferrer: {
                await setReferrer(response);
                break;
            }
            case RequestTypes.reportSite: {
                await adguard.tabs.openPage(response.parameters.reportUrl);

                /** The popup in Firefox is not closed after opening new tabs by Tabs API.
                 *  Reload re-renders popup. */
                window.location.reload();
                break;
            }
            case RequestTypes.setProtectionStatus: {
                await setProtection(response.appState.isProtectionEnabled);
                await adguard.tabs.updateIconColor(response.appState.isProtectionEnabled);
                break;
            }
            case RequestTypes.openSettings:
            case RequestTypes.openFilteringLog: {
                window.close();
                break;
            }
            default: {
                break;
            }
        }
    });

    global.adguard = {};

    const createGlobalActions = (globalVar, ActionTypes, apiName, apiType) => {
        // eslint-disable-next-line no-param-reassign
        globalVar[apiName] = {};
        Object.values(ActionTypes)
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

    createGlobalActions(adguard, RequestTypes,
        apiTypes.requests, INNER_MESSAGING_TYPES.API_REQUEST);
    createGlobalActions(adguard, TabActions,
        apiTypes.tabs, INNER_MESSAGING_TYPES.TAB_ACTION);

    ReactDOM.render(
        <Provider>
            <App />
        </Provider>,
        document.getElementById('root')
    );
} catch (error) {
    log.error(error);
}
