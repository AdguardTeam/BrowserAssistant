import React from 'react';
import './AppClosed.pcss';

function defineWarning(appState) {
    const { isInstalled, isRunning, isProtectionEnabled } = appState;
    if (!isInstalled) {
        return {
            warningName: isInstalled,
            title: 'AdGuard is not installed',
            buttonText: 'download',
        };
    }
    if (!isRunning) {
        return {
            warningName: isRunning,
            title: 'AdGuard is not running',
            buttonText: 'run adguard',
        };
    }
    if (!isProtectionEnabled) {
        return {
            warningName: isProtectionEnabled,
            title: 'AdGuard protection is paused',
            buttonText: 'enable',
        };
    }
    return {
        title: 'pending',
        buttonText: 'pending',
    };
}

const AppClosed = ({ appState, changeAppState }) => {
    const { title, buttonText, warningName } = defineWarning(appState);
    return (
        <div className="app-closed__wrapper">
            <header className="app-closed__status">{title}</header>
            <button
                className="app-closed__button"
                type="button"
                onClick={() => {
                    console.log(warningName, appState);
                    changeAppState(changeAppState(
                        { ...appState, [warningName]: !appState[warningName] }
                    ));
                }}
            >
                {buttonText}
            </button>
        </div>
    );
};

export default AppClosed;
