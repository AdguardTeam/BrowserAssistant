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
    const [isDevelopmentMode, toggleMode] = useState(false);

    const appClass = classNames({
        'loading--pending': status === 'pending',
        'loading--success': status === 'success',
    });

    useEffect(() => {
        requestsStore.getCurrentAppState();
        requestsStore.getCurrentFilteringState();
        settingsStore.getReferrer();
        browser.runtime.onMessage.addListener(
            (response) => {
                const { parameters, appState, requestId } = response;
                if (!requestId) {
                    return null;
                }
                const { isInstalled, isRunning, isProtectionEnabled } = appState;
                const workingState = [isInstalled, isRunning, isProtectionEnabled];

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

                return setRequestStatus(workingState.every(state => state === true)
                    ? REQUEST_STATUSES.SUCCESS : REQUEST_STATUSES.ERROR);
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
                        onClick={() => settingsStore.setFiltering(
                            !settingsStore.isFilteringEnabled
                        )}
                        type="button"
                    >
                        {settingsStore.isFilteringEnabled ? 'enabled' : 'disabled'}
                    </button>
                    <br />
                </div>
            )}
        </Fragment>
    );
};

export default App;
