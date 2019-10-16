import React, { Fragment, useState } from 'react';
import Settings from '../Settings';
import Header from '../Header';
import Options from '../Options';
import CurrentSite from '../CurrentSite';
import AppClosed from './AppClosed';

let status = 'isNotRunning';

function App() {
    const [isSecure, toggleSecure] = useState(true);
    const [isSecureProtocol, toggleProtocol] = useState(false);
    const [isCertificateExpired, toggleExpire] = useState(false);
    const [isDisabled, toggleDisable] = useState(false);
    const [isWorking, toggleWork] = useState(true);
    const [isChanged, toggleChange] = useState(false);
    return (
        <Fragment>
            {isWorking && (
                <Fragment>
                    <Header />
                    <CurrentSite
                        isSecure={isSecure}
                        isSecureProtocol={isSecureProtocol}
                        isCertificateExpired={isCertificateExpired}
                    />
                    <Settings isSecure={isSecure} />
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
                    {isChanged ? 'Changed' : 'Normal'}
                </button>
                <button
                    onClick={() => toggleSecure(!isSecure)}
                    type="button"
                >
                    {isSecure ? 'secure' : 'normal'}
                </button>
                <button
                    onClick={() => toggleProtocol(!isSecureProtocol)}
                    type="button"
                >
                    {isSecureProtocol ? 'HTTPS' : 'HTTP'}
                </button>
                <button
                    onClick={() => toggleExpire(!isCertificateExpired)}
                    type="button"
                >
                    {isCertificateExpired ? 'EXPIRED' : 'NOT EXPIRED'}
                </button>
                <button
                    onClick={() => toggleDisable(!isDisabled)}
                    type="button"
                >
                    {isDisabled ? 'Disabled' : 'Enabled'}
                </button>
                <button
                    onClick={() => toggleDisable(!isDisabled)}
                    type="button"
                >
                    {isDisabled ? 'Site Disabled' : 'Site Enabled'}
                </button>
                <br />
                <button
                    onClick={() => toggleWork(!isWorking)}
                    type="button"
                >
                    {isWorking ? 'App work' : 'App is not working'}
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
}

export default App;
