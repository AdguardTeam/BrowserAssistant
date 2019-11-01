import React, {
    Fragment, useState, useEffect, useContext,
} from 'react';
import Modal from 'react-modal';
import browser from 'webextension-polyfill';
import classNames from 'classnames';
import Settings from '../Settings';
import Header from '../Header';
import Options from '../Options';
import CurrentSite from '../CurrentSite';
import AppClosed from './AppClosed';
import rootStore from '../../stores';
import { REQUEST_STATUSES } from '../../stores/consts';

Modal.setAppElement('#root');

const App = () => {
    const { settingsStore, uiStore, requestsStore } = useContext(rootStore);
    const [status, setRequestStatus] = useState(REQUEST_STATUSES.PENDING);

    const appClass = classNames({
        'loading--pending': status === REQUEST_STATUSES.PENDING,
        'loading--success': status === REQUEST_STATUSES.SUCCESS,
    });

    useEffect(() => {
        (async () => {
            await settingsStore.getCurrentTabHostname();
            await settingsStore.getReferrer();
            requestsStore.getCurrentAppState();
            requestsStore.getCurrentFilteringState();
            uiStore.getStatusIsPageChanged();
        })();


        browser.runtime.onMessage.addListener(
            (response) => {
                const { parameters, appState, requestId } = response;
                if (!requestId) {
                    return true;
                }
                const { isInstalled, isRunning, isProtectionEnabled } = appState;
                const workingState = [isInstalled, isRunning, isProtectionEnabled];

                uiStore.setAppWorkingStatus(workingState.every(state => state === true));

                if (parameters && parameters.originCertStatus) {
                    const {
                        isFilteringEnabled,
                        isHttpsFilteringEnabled,
                        isPageSecured,
                        originCertStatus,
                    } = parameters;
                    settingsStore.setSecure(isPageSecured);
                    settingsStore.setHttpsFiltering(isHttpsFilteringEnabled);
                    settingsStore.setFiltering(isFilteringEnabled);
                    settingsStore.setOriginCertStatus(originCertStatus);
                }
                settingsStore.setInstalled(isInstalled);
                settingsStore.setRunning(isRunning);
                settingsStore.setProtection(isProtectionEnabled);

                setRequestStatus(uiStore.isAppWorking
                    ? REQUEST_STATUSES.SUCCESS : REQUEST_STATUSES.ERROR);
                return true;
            }
        );

        return () => {
            browser.runtime.onMessage.removeListener(msg => console.log('remove runtime.onMessage listener in popup', msg));
        };
    }, [settingsStore.isInstalled, settingsStore.isRunning, settingsStore.isProtectionEnabled]);
    return (
        <Fragment>
            {status !== 'error'
            && (
                <div className={appClass}>
                    <Header />
                    <CurrentSite />
                    <Settings />
                    <Options />
                </div>
            )}
            {status === 'error' && (
                <Fragment>
                    <Header />
                    <AppClosed />
                </Fragment>
            )}
        </Fragment>
    );
};

export default App;
