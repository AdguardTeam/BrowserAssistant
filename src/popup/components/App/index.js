import React, { useEffect, useContext } from 'react';
import Modal from 'react-modal';
import browser from 'webextension-polyfill';
import { observer } from 'mobx-react';
import Settings from '../Settings';
import Options from '../Options';
import CurrentSite from '../CurrentSite';
import AppClosed from './AppClosed';
import AppWrapper from './AppWrapper';
import rootStoreCtx from '../../stores';
import {
    BACKGROUND_COMMANDS,
    HOST_RESPONSE_TYPES,
    REQUEST_TYPES,
    SETUP_STATES,
    TAB_ACTIONS,
} from '../../../lib/types';
import Loading from '../ui/Loading';

Modal.setAppElement('#root');

const App = observer(() => {
    const {
        settingsStore: {
            setCurrentFilteringState,
            setCurrentAppState,
            getCurrentTabUrlProperties,
            setInstalled,
            setIsAppUpToDate,
            setIsExtensionUpdated,
            setIsSetupCorrect,
            setCurrentTabUrlProperties,
            getReferrer,
            setReferrer,
            setProtection,
        },
        uiStore: {
            setExtensionLoadingAndPending,
            setExtensionLoading,
            requestStatus,
            normalizePopupScale,
        },
        requestsStore: {
            getCurrentFilteringState,
        },
    } = useContext(rootStoreCtx);

    useEffect(() => {
        (async () => {
            await getCurrentTabUrlProperties();
            normalizePopupScale();

            const {
                isAppUpToDate,
                isExtensionUpdated,
                isSetupCorrect,
            } = await browser.storage.local.get(Object.keys(SETUP_STATES));

            setIsAppUpToDate(isAppUpToDate);
            setIsExtensionUpdated(isExtensionUpdated);
            setIsSetupCorrect(isSetupCorrect);
        })();

        browser.runtime.onMessage.addListener(
            async ({ msgType, response }) => {
                switch (msgType) {
                    case BACKGROUND_COMMANDS.SHOW_IS_NOT_INSTALLED:
                        setInstalled(false);
                        setExtensionLoadingAndPending();
                        break;
                    case BACKGROUND_COMMANDS.SHOW_SETUP_INCORRECT:
                        setExtensionLoadingAndPending();
                        break;
                    case BACKGROUND_COMMANDS.SHOW_RELOAD:
                        setExtensionLoading(true);
                        break;
                    case HOST_RESPONSE_TYPES.ok:
                        setExtensionLoadingAndPending();
                        break;
                    case TAB_ACTIONS.getCurrentTabUrlProperties:
                        setCurrentTabUrlProperties(response);
                        await getReferrer();
                        await getCurrentFilteringState();
                        break;
                    case TAB_ACTIONS.getReferrer:
                        await setReferrer(response);
                        break;
                    case REQUEST_TYPES.reportSite:
                        await adguard.tabs.openPage(response.parameters.reportUrl);

                        /** The popup in Firefox is not closed after opening new tabs by Tabs API.
                         *  Reload re-renders popup. */
                        window.location.reload();
                        break;
                    case REQUEST_TYPES.setProtectionStatus:
                        await setProtection(response.appState.isProtectionEnabled);
                        await adguard.tabs.updateIconColor(response.appState.isProtectionEnabled);
                        break;
                    case REQUEST_TYPES.openSettings:
                    case REQUEST_TYPES.openFilteringLog:
                        window.close();
                        break;
                    default:
                        break;
                }

                if (!response) {
                    return;
                }

                const {
                    parameters, appState, requestId,
                } = response;

                if (!requestId) {
                    return;
                }

                if (parameters && parameters.originalCertStatus) {
                    setCurrentFilteringState(parameters);
                }

                setCurrentAppState(appState);
            }
        );

        return () => {
            browser.runtime.onMessage.removeListener();
        };
    }, []);

    if (requestStatus.isError || requestStatus.isPending) {
        return (
            <AppWrapper>
                <AppClosed />
            </AppWrapper>
        );
    }

    if (requestStatus.isSuccess) {
        return (
            <AppWrapper>
                <CurrentSite />
                <Settings />
                <Options />
            </AppWrapper>
        );
    }

    return (<Loading />);
});

export default App;
