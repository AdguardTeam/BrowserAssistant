import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import rootStore from '../../../stores';
import './AppClosed.pcss';

const states = {
    isNotInstalled: {
        title: 'AdGuard is not installed',
        buttonText: 'download',
        updateStore: settingsStore => settingsStore.setInstalled(true),
    },

    isNotRunning: {
        title: 'AdGuard is not running',
        buttonText: 'run adguard',
        updateStore: (settingsStore, requestsStore) => {
            settingsStore.setRunning(true);
            requestsStore.startApp();
        },
    },

    isProtectionDisabled: {
        title: 'AdGuard protection is paused',
        buttonText: 'enable',
        updateStore: settingsStore => settingsStore.toggleProtection(),
    },

    isAppNotUpdated: {
        title: 'AdGuard is not updated',
        buttonText: 'update',
        updateStore: settingsStore => settingsStore.updateApp(),
    },

    isExtensionNotUpdated: {
        title: 'Assistant is not updated',
        buttonText: 'update',
        updateStore: settingsStore => settingsStore.updateExtension(),
    },

    isPending: {
        title: 'pending',
        buttonText: 'pending',
        updateStore: () => null,
    },
};

function defineWarning(settingsStore) {
    const {
        isInstalled, isRunning, isProtectionEnabled, isAppUpdated, isExtensionUpdated,
    } = settingsStore;

    if (!isInstalled) {
        return states.isNotInstalled;
    }

    if (!isRunning) {
        return states.isNotRunning;
    }

    if (!isProtectionEnabled) {
        return states.isProtectionDisabled;
    }

    if (!isAppUpdated) {
        return states.isAppNotUpdated;
    }

    if (!isExtensionUpdated) {
        return states.isExtensionNotUpdated;
    }

    return states.isPending;
}

const AppClosed = observer(() => {
    const { requestsStore, settingsStore, uiStore } = useContext(rootStore);

    const { title, buttonText, updateStore } = defineWarning(settingsStore);
    return (
        <div className="app-closed__wrapper">
            <div className="app-closed__status-wrapper">
                <header className="app-closed__status">{title}</header>
            </div>
            <button
                className="app-closed__button"
                type="button"
                onClick={() => {
                    updateStore(settingsStore, requestsStore);
                    uiStore.updateUi();
                }}
            >
                {buttonText}
            </button>
        </div>
    );
});

export default AppClosed;
