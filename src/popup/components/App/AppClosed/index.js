import React from 'react';
import './AppClosed.pcss';

function defineWarning(appState) {
    const { isInstalled, isRunning, isProtectionEnabled } = appState;
    if (!isInstalled) {
        return {
            title: 'AdGuard is not installed',
            buttonText: 'download',
        };
    }
    if (!isRunning) {
        return {
            title: 'AdGuard is not running',
            buttonText: 'run adguard',
        };
    }
    if (!isProtectionEnabled) {
        return {
            title: 'AdGuard protection is paused',
            buttonText: 'enable',
        };
    }
    return {
        title: 'pending',
        buttonText: 'pending',
    };
}

const AppClosed = ({ appState }) => {
    const { title, buttonText } = defineWarning(appState);
    return (
        <div className="app-closed__wrapper">
            <header className="app-closed__status">{title}</header>
            <button className="app-closed__button" type="button">{buttonText}</button>
        </div>
    );
};

export default AppClosed;
