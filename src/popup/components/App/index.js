import React, { Fragment, useState } from 'react';
import Settings from '../Settings';
import Header from '../Header';
import Options from '../Options';
import CurrentSite from '../CurrentSite';
import AppClosed from './AppClosed';

const appState = {
    isInstalled: false,
    isRunning: false,
    isProtectionEnabled: false,
};

let STATES = Object.keys(appState);

let status = STATES[0];


const App = () => {
    const [isPageSecured, toggleSecure] = useState(false);
    const [isHttpsFilteringEnabled, toggleHttpsFiltering] = useState(false);
    const [isExpired, toggleExpire] = useState(false);
    const [isDisabled, toggleDisable] = useState(false);
    const [isWorking, toggleWork] = useState(true);
    const [isChanged, toggleChange] = useState(false);
    const [isDevelopmentMode, toggleMode] = useState(true);
    return (
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
                    <AppClosed status={status} />
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
                    {isWorking && (
                        <select onChange={(e) => {
                            STATES = STATES.filter(el => el !== e.target.value);
                            STATES.unshift(e.target.value);
                            status = e.target.value;
                        }}
                        >
                            {STATES.map(el => (<option key={el} value={el}>{`${el} : ${appState[el]}`}</option>))}
                        </select>
                    )
                    }
                </div>
            )}
        </Fragment>
    );
};

export default App;
