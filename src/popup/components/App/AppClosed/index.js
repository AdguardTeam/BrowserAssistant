import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import rootStore from '../../../stores';
import './AppClosed.pcss';

function defineWarning(settingsStore) {
    const { isInstalled, isRunning, isProtectionEnabled } = settingsStore;
    if (!isInstalled) {
        return {
            title: 'AdGuard is not installed',
            buttonText: 'download',
            handleClick: () => settingsStore.setInstalled(true),
        };
    }
    if (!isRunning) {
        return {
            title: 'AdGuard is not running',
            buttonText: 'run adguard',
            handleClick: () => settingsStore.setRunning(true),
        };
    }
    if (!isProtectionEnabled) {
        return {
            title: 'AdGuard protection is paused',
            buttonText: 'enable',
            handleClick: () => settingsStore.setProtection(true),
        };
    }
    return {
        title: 'pending',
        buttonText: 'pending',
        handleClick: () => console.log('pending clicked'),
    };
}

const AppClosed = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const { title, buttonText, handleClick } = defineWarning(settingsStore);
    return (
        <div className="app-closed__wrapper">
            <header className="app-closed__status">{title}</header>
            <button
                className="app-closed__button"
                type="button"
                onClick={handleClick}
            >
                {buttonText}
            </button>
        </div>
    );
});

export default AppClosed;
