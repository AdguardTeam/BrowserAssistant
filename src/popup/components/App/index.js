import React, { Fragment, useState } from 'react';
import Settings from '../Settings';
import Header from '../Header';
import Options from '../Options';
import CurrentSite from '../CurrentSite';
import AppClosed from './AppClosed';

let STATES = ['isNotRunning', 'isNotInstalled', 'isPaused'];
let status = STATES[0];


const App = () => {
    const [isTrusted, toggleSecure] = useState(false);
    const [isHTTPS, toggleProtocol] = useState(false);
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
                        isTrusted={isTrusted}
                        isHTTPS={isHTTPS}
                        isExpired={isExpired}
                    />
                    <Settings isTrusted={isTrusted} />
                    <Options isDisabled={isDisabled} isChanged={isChanged} />
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
            <div className="TODO-DELETE-TEST-BUTTONS">
                <h6>Current state:</h6>
                <button
                    onClick={() => toggleChange(!isChanged)}
                    type="button"
                >
                    {isChanged ? 'changed' : 'default'}
                </button>
                <button
                    onClick={() => toggleSecure(!isTrusted)}
                    type="button"
                >
                    {isTrusted ? 'trusted' : 'usual'}
                </button>
                <button
                    onClick={() => toggleProtocol(!isHTTPS)}
                    type="button"
                >
                    {isHTTPS ? 'HTTPS' : 'HTTP'}
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
                    {`make window ${isWorking ? '' : 'working'}`}
                </button>
                {isWorking && (
                <select onChange={(e) => {
                    STATES = STATES.filter(el => el !== e.target.value);
                    STATES.unshift(e.target.value);
                    status = e.target.value;
                }}
                >
                    {STATES.map(el => (<option key={el}>{el}</option>))}
                </select>
                )
                }
            </div>
            )}
        </Fragment>
    );
};

export default App;
