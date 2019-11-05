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
    const {
        setSecure, setHttpsFiltering, setFiltering, setOriginCertStatus,
        setInstalled, setRunning, setProtection, isInstalled, isRunning,
        isProtectionEnabled, isPageSecured, isHttpsFilteringEnabled,
        isFilteringEnabled, originCertStatus, getCurrentTabHostname, getReferrer,
    } = settingsStore;

    const appClass = classNames({
        'loading--pending': status === REQUEST_STATUSES.PENDING,
        'loading--success': status === REQUEST_STATUSES.SUCCESS,
    });

    useEffect(() => {
        (async () => {
            await getCurrentTabHostname();
            await getReferrer();
            requestsStore.getCurrentAppState();
            requestsStore.getCurrentFilteringState();
        })();

        browser.runtime.onMessage.addListener(
            // eslint-disable-next-line consistent-return
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
                        isPageFilteredByUserFilter,
                    } = parameters;
                    setSecure(isPageSecured);
                    setHttpsFiltering(isHttpsFilteringEnabled);
                    setFiltering(isFilteringEnabled);
                    setOriginCertStatus(originCertStatus);
                    uiStore.setPageChanged(isPageFilteredByUserFilter);
                }
                setInstalled(isInstalled);
                setRunning(isRunning);
                setProtection(isProtectionEnabled);

                setRequestStatus(uiStore.isAppWorking
                    ? REQUEST_STATUSES.SUCCESS : REQUEST_STATUSES.ERROR);
            }
        );

        return () => {
            browser.runtime.onMessage.removeListener();
        };
    }, [isInstalled, isRunning, isProtectionEnabled, isPageSecured,
        isHttpsFilteringEnabled, isFilteringEnabled, originCertStatus]);
    return (
        <Fragment>
            {status !== REQUEST_STATUSES.ERROR
            && (
                <div className={appClass}>
                    <Header />
                    <CurrentSite />
                    <Settings />
                    <Options />
                </div>
            )}
            {status === REQUEST_STATUSES.ERROR && (
                <Fragment>
                    <Header />
                    <AppClosed />
                </Fragment>
            )}
            <div
                className="TODO-DELETE-TEST-BUTTONS"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <span style={{ fontSize: '1.5rem' }}>Current state:</span>
                <button
                    onClick={() => uiStore.setPageChanged(!uiStore.isPageChanged)}
                    type="button"
                >
                    {uiStore.isPageChanged ? 'changed' : 'default'}
                </button>
                <button
                    onClick={() => settingsStore
                        .setSecure(!settingsStore.isPageSecured)}
                    type="button"
                >
                    {settingsStore.isPageSecured ? 'secured' : 'usual'}
                </button>
                <button
                    onClick={() => settingsStore
                        .setHttpsFiltering(!settingsStore.isHttpsFilteringEnabled)}
                    type="button"
                >
                    {settingsStore.isHttpsFilteringEnabled ? 'filtering HTTPS' : 'not filtering HTTPS'}
                </button>
                <button
                    onClick={() => settingsStore.setExpire(!settingsStore.isExpired)}
                    type="button"
                >
                    {settingsStore.isExpired ? 'expired' : 'valid'}
                </button>
                <button
                    onClick={() => settingsStore.setFiltering(
                        !settingsStore.isFilteringEnabled
                    )}
                    type="button"
                >
                    {settingsStore.isFilteringEnabled ? 'enabled' : 'disabled'}
                </button>
                <br />
            </div>
        </Fragment>

    );
};

export default App;
