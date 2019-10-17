import React, { Fragment, useState } from 'react';
import Settings from '../Settings';
import Header from '../Header';
import Options from '../Options';
import CurrentSite from '../CurrentSite';
import AppClosed from './AppClosed';

let status = 'isNotRunning';

const App = () => {
    const [isTrusted, toggleSecure] = useState(false);
    const [isHTTPS, toggleProtocol] = useState(false);
    const [isExpired, toggleExpire] = useState(false);
    const [isDisabled, toggleDisable] = useState(false);
    const [isWorking, toggleWork] = useState(true);
    const [isChanged, toggleChange] = useState(false);
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
            <div className="TODO-delete-test-buttons">
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
                    {isWorking ? 'working' : 'not working'}
                </button>
                {isWorking && (
                    <select onChange={(e) => {
                        status = e.target.value;
                    }}
                    >
                        <option>isNotRunning</option>
                        <option>isNotInstalled</option>
                        <option>isPaused</option>
                    </select>
                )
                }
            </div>
        </Fragment>
    );
};

export default App;
