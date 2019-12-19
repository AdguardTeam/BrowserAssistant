import React, { Fragment, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import browser from 'webextension-polyfill';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import Settings from '../Settings';
import Header from '../Header';
import Options from '../Options';
import CurrentSite from '../CurrentSite';
import AppClosed from './AppClosed';
import rootStore from '../../stores';
import { REQUEST_STATUSES } from '../../stores/consts';
import { BACKGROUND_COMMANDS, HostResponseTypes } from '../../../lib/types';
import Loading from '../ui/Loading';

Modal.setAppElement('#root');

const App = observer(() => {
    const { settingsStore, uiStore, requestsStore } = useContext(rootStore);
    const {
        setCurrentFilteringState,
        setCurrentAppState,
        getCurrentTabHostname, getReferrer,
    } = settingsStore;

    const appClass = classNames({
        'loading--pending': uiStore.requestStatus === REQUEST_STATUSES.PENDING,
        'loading--success': uiStore.requestStatus === REQUEST_STATUSES.SUCCESS,
    });

    useEffect(() => {
        (async () => {
            await getCurrentTabHostname();
            await getReferrer();
            await requestsStore.getCurrentFilteringState();
        })();

        browser.runtime.onMessage.addListener(
            (response) => {
                const {
                    parameters, appState, requestId, result,
                } = response;

                switch (result) {
                    case BACKGROUND_COMMANDS.SHOW_SETUP_INCORRECTLY:
                        settingsStore.setSetupCorrectly(false);
                        uiStore.setReloading(false);
                        uiStore.setAppWorkingStatus();
                        break;
                    case BACKGROUND_COMMANDS.CLOSE_POPUP:
                        window.close();
                        break;
                    case BACKGROUND_COMMANDS.SHOW_RELOAD:
                        uiStore.setReloading(true);
                        break;
                    case HostResponseTypes.ok:
                        uiStore.setReloading(false);
                        break;
                    default:
                        break;
                }

                if (!requestId) {
                    return;
                }

                const { isInstalled, isRunning, isProtectionEnabled } = appState;
                const workingStatus = { isInstalled, isRunning, isProtectionEnabled };

                if (parameters && parameters.originalCertStatus) {
                    setCurrentFilteringState(parameters);
                }
                setCurrentAppState(workingStatus);
                uiStore.setAppWorkingStatus(workingStatus);
            }
        );

        return () => {
            browser.runtime.onMessage.removeListener();
        };
    }, []);

    return (
        <Fragment>
            {uiStore.requestStatus !== REQUEST_STATUSES.PENDING && <Header />}
            {uiStore.requestStatus === REQUEST_STATUSES.PENDING && <Loading title="Preparing..." />}
            {uiStore.requestStatus === REQUEST_STATUSES.SUCCESS && (
                <div className={appClass}>
                    <CurrentSite />
                    <Settings />
                    <Options />
                </div>
            )}
            {uiStore.requestStatus === REQUEST_STATUSES.ERROR && <AppClosed />}
            {uiStore.isLoading && <Loading />}
        </Fragment>

    );
});

export default App;
