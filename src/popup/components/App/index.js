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
import { HostResponseTypes } from '../../../lib/types';

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
            requestsStore.getCurrentFilteringState();
        })();

        browser.runtime.onMessage.addListener(
            (response) => {
                if (response.result === HostResponseTypes.ok) {
                    uiStore.setPending(false);
                }

                if (response.result === HostResponseTypes.error) {
                    uiStore.setPending(true);
                }

                const { parameters, appState, requestId } = response;

                if (!requestId) {
                    return;
                }

                const { isInstalled, isRunning, isProtectionEnabled } = appState;
                const workingStatus = { isInstalled, isRunning, isProtectionEnabled };

                uiStore.setAppWorkingStatus(workingStatus);

                if (parameters && parameters.originCertStatus) {
                    setCurrentFilteringState(parameters);
                }

                setCurrentAppState(workingStatus);
                uiStore.setRequestStatus();
            }
        );

        return () => {
            browser.runtime.onMessage.removeListener();
        };
    }, []);
    return (
        <Fragment>
            {uiStore.requestStatus === REQUEST_STATUSES.SUCCESS
            && (
                <div className={appClass}>
                    <Header />
                    <CurrentSite />
                    <Settings />
                    <Options />
                </div>
            )}
            {uiStore.requestStatus === REQUEST_STATUSES.ERROR && (
                <Fragment>
                    <Header />
                    <AppClosed />
                </Fragment>
            )}
        </Fragment>

    );
});

export default App;
