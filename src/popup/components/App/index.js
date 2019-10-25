import React, { Fragment, useState, useEffect } from 'react';
import browser from 'webextension-polyfill';
import Settings from '../Settings';
import Header from '../Header';
import Options from '../Options';
import CurrentSite from '../CurrentSite';
import AppClosed from './AppClosed';

const App = () => {
    const [isWorking, toggleWork] = useState(true);
    const [appState, changeAppWorkingState] = useState({
        isInstalled: true,
        isRunning: true,
        isProtectionEnabled: true,
    });
    const [isPending, togglePending] = useState(true);
    useEffect(() => {
        adguard.request.init();
        adguard.request.getCurrentAppState();
        adguard.request.getCurrentFilteringState();

        browser.runtime.onMessage.addListener(
            ({
                id, data, parameters, appState, result, requestId,
            }) => {
                console.log(`ResponseId = ${id} - Received: id = ${requestId}, parameters = ${JSON.stringify(parameters)}, appState = ${JSON.stringify(appState)}, result = ${result}, data = ${data || 'no additional data received'}`);

                const { isInstalled, isRunning, isProtectionEnabled } = appState;
                const workingState = [isInstalled, isRunning, isProtectionEnabled];

                togglePending(false);
                changeAppWorkingState(appState);
                toggleWork(workingState.every(state => state === true));
            }
        );

        return () => {
            browser.runtime.onMessage.removeListener(msg => console.log('remove runtime.onMessage listener in popup', msg));
        };
    }, [appState.isInstalled, appState.isRunning, appState.isProtectionEnabled]);

    const [isPageSecured, toggleSecure] = useState(false);
    const [isHttpsFilteringEnabled, toggleHttpsFiltering] = useState(false);
    const [isExpired, toggleExpire] = useState(false);
    const [isDisabled, toggleDisable] = useState(false);
    const [isChanged, toggleChange] = useState(false);
    const [isDevelopmentMode, toggleMode] = useState(true);
    return (
        <Fragment>
            {!isPending && (
                <Fragment>
                    {isWorking && (
                        <Fragment>
                            <Header />
                            <CurrentSite
                                isPageSecured={isPageSecured}
                                isHttpsFilteringEnabled={isHttpsFilteringEnabled}
                                isExpired={isExpired}
                            />
                            <Settings
                                isPageSecured={isPageSecured}
                                isHttpsFilteringEnabled={isHttpsFilteringEnabled}
                                isDisabled={isDisabled}
                            />
                            <Options
                                isDisabled={isDisabled}
                                isChanged={isChanged}
                                isPageSecured={isPageSecured}
                            />
                        </Fragment>
                    )}
                    {!isWorking && (
                        <Fragment>
                            <Header />
                            <AppClosed appState={appState} />
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
                                onClick={() => toggleDisable(!isDisabled)}
                                type="button"
                            >
                                {isDisabled ? 'disabled' : 'enabled'}
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
