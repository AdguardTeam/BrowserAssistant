import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import rootStore from '../../../stores';
import './AppClosed.pcss';

function defineWarning() {
    const { requestsStore, settingsStore, uiStore } = useContext(rootStore);
    const { isInstalled, isRunning, isProtectionEnabled } = settingsStore;
    const isAppUpdated = uiStore.isValidatedOnHost;
    const isExtensionUpdated = uiStore.isValidatedOnHost;

    if (!isInstalled) {
        return ({
            title: 'AdGuard is not installed',
            buttonText: 'download',
            handleClick: () => {
                settingsStore.setInstalled(true);
                uiStore.updateUi();
            },
        });
    }

    if (!isRunning) {
        return ({
            title: 'AdGuard is not running',
            buttonText: 'run adguard',
            handleClick: () => {
                settingsStore.setRunning(true);
                uiStore.updateUi();
                requestsStore.runAdguard();
            },
        });
    }

    if (!isProtectionEnabled) {
        return ({
            title: 'AdGuard protection is paused',
            buttonText: 'enable',
            handleClick: () => {
                settingsStore.toggleProtection();
                uiStore.updateUi();
            },
        });
    }

    if (!isAppUpdated) {
        return ({
            title: 'AdGuard is not updated',
            buttonText: 'update',
            handleClick: () => {
                console.log('UPDATING ADGUARD');
            },
        });
    }

    if (!isExtensionUpdated) {
        return ({
            title: 'Assistant is not updated',
            buttonText: 'update',
            handleClick: () => {
                console.log('UPDATING ASSISTANT');
            },
        });
    }

    return ({
        title: 'pending',
        buttonText: 'pending',
        handleClick: null,
    });
}

const AppClosed = observer(() => {
    const { title, buttonText, handleClick } = defineWarning();
    return (
        <div className="app-closed__wrapper">
            <div className="app-closed__status-wrapper">
                <header className="app-closed__status">{title}</header>
            </div>
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
