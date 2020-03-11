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
import { BACKGROUND_COMMANDS, HostResponseTypes, setupStates } from '../../../lib/types';
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
            setIsSetupCorrectly,
        },
        uiStore: {
            setExtensionLoadingAndPending,
            setExtensionLoading,
            requestStatus,
        },
    } = useContext(rootStoreCtx);

    useEffect(() => {
        (async () => {
            await getCurrentTabUrlProperties();
            // TODO: normalizePopupScale

            const {
                isAppUpToDate,
                isExtensionUpdated,
                isSetupCorrectly,
            } = await browser.storage.local.get(setupStates);

            setIsAppUpToDate(isAppUpToDate);
            setIsExtensionUpdated(isExtensionUpdated);
            setIsSetupCorrectly(isSetupCorrectly);
        })();

        browser.runtime.onMessage.addListener(
            (response) => {
                const {
                    parameters, appState, requestId, result,
                } = response;

                switch (result) {
                    case BACKGROUND_COMMANDS.SHOW_IS_NOT_INSTALLED:
                        setInstalled(false);
                        setExtensionLoadingAndPending();
                        break;
                    case BACKGROUND_COMMANDS.SHOW_SETUP_INCORRECTLY:
                        setExtensionLoadingAndPending();
                        break;
                    case BACKGROUND_COMMANDS.SHOW_RELOAD:
                        setExtensionLoading(true);
                        break;
                    case HostResponseTypes.ok:
                        setExtensionLoadingAndPending();
                        break;
                    default:
                        break;
                }

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
