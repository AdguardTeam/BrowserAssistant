import React, {
    Fragment, useState, useEffect, useContext,
} from 'react';
import Modal from 'react-modal';
import browser from 'webextension-polyfill';
import Settings from '../Settings';
import Header from '../Header';
import Options from '../Options';
import CurrentSite from '../CurrentSite';
import AppClosed from './AppClosed';
import rootStore from '../../stores';
import { REQUEST_STATUSES } from '../../stores/consts';

Modal.setAppElement('#root');

const App = () => {
    const { settingsStore, uiStore } = useContext(rootStore);
    const [status, setRequestStatus] = useState(REQUEST_STATUSES.PENDING);
    const [isDevelopmentMode, toggleMode] = useState(true);

    useEffect(() => {
        adguard.requests.init();
        adguard.requests.getCurrentAppState();
        adguard.requests.getCurrentFilteringState();
        browser.runtime.onMessage.addListener(
            ({
                id, data, parameters, appState, result, requestId,
            }) => {
                console.log(`ResponseId = ${id} - Received: id = ${requestId}, parameters = ${JSON.stringify(parameters)}, appState = ${JSON.stringify(appState)}, result = ${result}, data = ${data || 'no additional data received'}`);

                // makePending(false);
                const { isInstalled, isRunning, isProtectionEnabled } = appState;
                const workingState = [isInstalled, isRunning, isProtectionEnabled];

                if (parameters && parameters.originCertStatus) {
                    const {
                        isFilteringEnabled,
                        isHttpsFilteringEnabled,
                        isPageSecured,
                    } = parameters;
                    settingsStore.setSecure(isPageSecured);
                    settingsStore.setHttpsFiltering(isHttpsFilteringEnabled);
                    settingsStore.setFiltering(isFilteringEnabled);
                }
                settingsStore.setInstalled(isInstalled);
                settingsStore.setRunning(isRunning);
                settingsStore.setProtection(isProtectionEnabled);
                console.log('workingState', workingState);

                setRequestStatus(workingState.every(state => state === true)
                    ? REQUEST_STATUSES.SUCCESS : REQUEST_STATUSES.ERROR);
            }
        );

        return () => {
            browser.runtime.onMessage.removeListener(msg => console.log('remove runtime.onMessage listener in popup', msg));
        };
    }, [settingsStore.isInstalled, settingsStore.isRunning, settingsStore.isProtectionEnabled]);
    return (
        <Fragment>
            {status === 'success' && (
            <Fragment>
                <Header />
                <CurrentSite />
                <Settings />
                <Options />
            </Fragment>
            )}
            {status === 'error' && (
            <Fragment>
                <Header />
                <AppClosed />
            </Fragment>
            )}
            {status === 'pending' && (
                <Fragment>
                    <div>pending</div>
                </Fragment>
            )}
            <button
                onClick={() => toggleMode(!isDevelopmentMode)}
                type="button"
            >
                {`${isDevelopmentMode ? 'hide' : 'show'} development buttons`}
            </button>
            {isDevelopmentMode && (
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
                    onClick={() => uiStore.toggleChange(!uiStore.isPageChanged)}
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
                    onClick={() => settingsStore
                        .setFiltering(!settingsStore.isFilteringEnabled)}
                    type="button"
                >
                    {settingsStore.isFilteringEnabled ? 'enabled' : 'disabled'}
                </button>
                <br />
            </div>
            )}
        </Fragment>
    );
}

export default App;
