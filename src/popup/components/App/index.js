import React, { useEffect, useContext } from 'react';
import Modal from 'react-modal';
import browser from 'webextension-polyfill';
import { observer } from 'mobx-react';
import Settings from '../Settings';
import Options from '../Options';
import CurrentSite from '../CurrentSite';
import AppClosed from './AppClosed';
import AppWrapper from './AppWrapper';
import rootStore from '../../stores';
import { BACKGROUND_COMMANDS, HostResponseTypes } from '../../../lib/types';
import Loading from '../ui/Loading';

Modal.setAppElement('#root');

const App = observer(() => {
    const {
        settingsStore: {
            setCurrentFilteringState,
            setCurrentAppState,
            getCurrentTabHostname,
            getReferrer,
            setInstalled,
        },
        requestsStore: {
            getCurrentFilteringState,
        },
        uiStore: {
            setExtensionLoadingAndPending,
            setExtensionLoading,
            requestStatus,
        },
    } = useContext(rootStore);

    useEffect(() => {
        (async () => {
            await getCurrentTabHostname();
            await getReferrer();
            await getCurrentFilteringState();
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
