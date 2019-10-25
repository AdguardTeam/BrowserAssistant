import React, { Fragment, useState, useEffect } from 'react';
import Modal from 'react-modal';
import browser from 'webextension-polyfill';
import Settings from '../Settings';
import Header from '../Header';
import Options from '../Options';
import CurrentSite from '../CurrentSite';
import AppClosed from './AppClosed';

Modal.setAppElement('#root');

const App = () => {
    const [isWorking, toggleWork] = useState(true);
    const [appState, changeAppState] = useState({
        isInstalled: true,
        isRunning: true,
        isProtectionEnabled: true,
    });
    const [isPageSecured, toggleSecure] = useState(false);
    const [isHttpsFilteringEnabled, toggleHttpsFiltering] = useState(false);
    const [isExpired, toggleExpire] = useState(false);
    const [isFilteringEnabled, toggleFiltering] = useState(true);
    const [isChanged, toggleChange] = useState(false);
    const [isDevelopmentMode, toggleMode] = useState(true);
    const [isPending, makePending] = useState(true);

    useEffect(() => {
        adguard.requests.init();
        adguard.requests.getCurrentAppState();
        adguard.requests.getCurrentFilteringState();
        browser.runtime.onMessage.addListener(
            ({
                id, data, parameters, appState, result, requestId,
            }) => {
                console.log(`ResponseId = ${id} - Received: id = ${requestId}, parameters = ${JSON.stringify(parameters)}, appState = ${JSON.stringify(appState)}, result = ${result}, data = ${data || 'no additional data received'}`);

                makePending(false);
                const { isInstalled, isRunning, isProtectionEnabled } = appState;
                const workingState = [isInstalled, isRunning, isProtectionEnabled];

                if (parameters.originCertStatus) {
                    const {
                        isFilteringEnabled,
                        isHttpsFilteringEnabled,
                        isPageSecured,
                        blockedAdsCount,
                        totalBlockedCount,
                        originCertStatus,
                    } = parameters;
                    toggleSecure(isPageSecured);
                    toggleHttpsFiltering(isHttpsFilteringEnabled);
                    toggleFiltering(isFilteringEnabled);

                    console.log(isFilteringEnabled,
                        isHttpsFilteringEnabled,
                        isPageSecured,
                        blockedAdsCount,
                        totalBlockedCount,
                        originCertStatus);
                }
                changeAppState(appState);
                console.log('workingState', workingState)
                toggleWork(workingState.every(state => state === true));
            }
        );

        return () => {
            browser.runtime.onMessage.removeListener(msg => console.log('remove runtime.onMessage listener in popup', msg));
        };
    }, [appState.isInstalled, appState.isRunning, appState.isProtectionEnabled]);
    return (
        <Fragment>
            {!isPending && (
                <Fragment>
                    {isWorking && (
                        <Fragment>
                            <Header
                                changeAppState={changeAppState}
                                appState={appState}
                            />
                            <CurrentSite
                                isPageSecured={isPageSecured}
                                isHttpsFilteringEnabled={isHttpsFilteringEnabled}
                                toggleHttpsFiltering={toggleHttpsFiltering}
                                isExpired={isExpired}
                            />
                            <Settings
                                isPageSecured={isPageSecured}
                                isHttpsFilteringEnabled={isHttpsFilteringEnabled}
                                isFilteringEnabled={isFilteringEnabled}
                                toggleFiltering={toggleFiltering}
                                toggleHttpsFiltering={toggleHttpsFiltering}
                            />
                            <Options
                                isFilteringEnabled={isFilteringEnabled}
                                isChanged={isChanged}
                                isPageSecured={isPageSecured}
                            />
                        </Fragment>
                    )}
                    {!isWorking && (
                        <Fragment>
                            <Header />
                            <AppClosed appState={appState} changeAppState={changeAppState} />
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
                                onClick={() => toggleChange(!isChanged)}
                                type="button"
                            >
                                {isChanged ? 'changed' : 'default'}
                            </button>
                            <button
                                onClick={() => toggleSecure(!isPageSecured)}
                                type="button"
                            >
                                {isPageSecured ? 'secured' : 'usual'}
                            </button>
                            <button
                                onClick={() => toggleHttpsFiltering(!isHttpsFilteringEnabled)}
                                type="button"
                            >
                                {isHttpsFilteringEnabled ? 'filtering HTTPS' : 'not filtering HTTPS'}
                            </button>
                            <button
                                onClick={() => toggleExpire(!isExpired)}
                                type="button"
                            >
                                {isExpired ? 'expired' : 'valid'}
                            </button>
                            <button
                                onClick={() => toggleFiltering(!isFilteringEnabled)}
                                type="button"
                            >
                                {isFilteringEnabled ? 'enabled' : 'disabled'}
                            </button>
                            <br />
                            <button
                                onClick={() => toggleWork(!isWorking)}
                                type="button"
                            >
                                {`make app ${isWorking ? '' : 'working'}`}
                            </button>
                        </div>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};

export default App;
