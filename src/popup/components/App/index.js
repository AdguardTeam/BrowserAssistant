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
import innerMessaging from '../../../lib/innerMessaging';

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

    const msgHandler = async (msg) => {
        const { type, params } = msg;
        switch (type) {
            case BACKGROUND_COMMANDS.SHOW_IS_NOT_INSTALLED:
                setInstalled(false);
                setExtensionLoadingAndPending();
                break;
            case BACKGROUND_COMMANDS.SHOW_RELOAD:
                setExtensionLoading(true);
                break;
            case TAB_ACTIONS.getCurrentTabUrlProperties:
                setCurrentTabUrlProperties(params);
                await getReferrer();
                await getCurrentFilteringState();
                break;
            case TAB_ACTIONS.getReferrer:
                await setReferrer(params);
                break;
            case REQUEST_TYPES.reportSite:
                await innerMessaging.openPage(params.parameters.reportUrl);

                /** The popup in Firefox is not closed after opening new tabs by Tabs API.
                 *  Reload re-renders popup. */
                window.location.reload();
                break;
            case REQUEST_TYPES.setProtectionStatus:
                await setProtection(params.appState.isProtectionEnabled);
                await innerMessaging.updateIconColor(params.appState.isProtectionEnabled);
                break;
            case REQUEST_TYPES.openSettings:
            case REQUEST_TYPES.openFilteringLog:
                window.close();
                break;
            case BACKGROUND_COMMANDS.SHOW_SETUP_INCORRECT:
            case HOST_RESPONSE_TYPES.ok:
            default:
                setExtensionLoadingAndPending();
                break;
        }

        if (!params) {
            return;
        }

        const {
            parameters, appState, requestId,
        } = params;

        if (!requestId) {
            return;
        }

        if (parameters && parameters.originalCertStatus) {
            setCurrentFilteringState(parameters);
        }

        setCurrentAppState(appState);
    };

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

        browser.runtime.onMessage.addListener(msgHandler);
        return () => browser.runtime.onMessage.removeListener(msgHandler);
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
