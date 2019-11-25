import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import rootStore from '../../../stores';
import './AppClosed.pcss';
import { NOT_WORKING_STATES } from '../../../stores/consts';

const PROBLEM_STATES = {
    [NOT_WORKING_STATES.IS_INSTALLED]: {
        state: NOT_WORKING_STATES.IS_INSTALLED,
        title: 'AdGuard is not installed',
        buttonText: 'download',
        updateStore: (settingsStore) => {
            settingsStore.openDownloadPage();
            window.close();
        },
    },

    [NOT_WORKING_STATES.IS_RUNNING]: {
        state: NOT_WORKING_STATES.IS_RUNNING,
        title: 'AdGuard is not running',
        buttonText: 'run adguard',
        updateStore: (settingsStore, requestsStore) => {
            settingsStore.setRunning(true);
            requestsStore.startApp();
        },
    },

    [NOT_WORKING_STATES.IS_PROTECTION_ENABLED]: {
        state: NOT_WORKING_STATES.IS_PROTECTION_ENABLED,
        title: 'AdGuard protection is paused',
        buttonText: 'enable',
        updateStore: settingsStore => settingsStore.toggleProtection(),
    },

    [NOT_WORKING_STATES.IS_APP_UPDATED]: {
        state: NOT_WORKING_STATES.IS_APP_UPDATED,
        title: 'AdGuard is not updated',
        buttonText: 'update',
        updateStore: settingsStore => settingsStore.updateApp(),
    },

    [NOT_WORKING_STATES.IS_EXTENSION_UPDATED]: {
        state: NOT_WORKING_STATES.IS_EXTENSION_UPDATED,
        id: 'isExtensionNotUpdated',
        title: 'Assistant is not updated',
        buttonText: 'update',
        updateStore: settingsStore => settingsStore.updateExtension(),
    },

    [NOT_WORKING_STATES.IS_RELOADING]: {
        state: NOT_WORKING_STATES.IS_RELOADING,
        title: 'Reloading...',
        buttonText: 'reloading...',
        updateStore: () => null,
    },
};

function defineWarning(settingsStore) {
    const {
        isInstalled, isRunning, isProtectionEnabled, isAppUpToDate, isExtensionUpdated,
    } = settingsStore;

    if (!isInstalled) {
        return PROBLEM_STATES[NOT_WORKING_STATES.IS_INSTALLED];
    }

    if (!isRunning) {
        return PROBLEM_STATES[NOT_WORKING_STATES.IS_RUNNING];
    }

    if (!isProtectionEnabled) {
        return PROBLEM_STATES[NOT_WORKING_STATES.IS_PROTECTION_ENABLED];
    }

    if (!isAppUpToDate) {
        return PROBLEM_STATES[NOT_WORKING_STATES.IS_APP_UP_TO_DATE];
    }

    if (!isExtensionUpdated) {
        return PROBLEM_STATES[NOT_WORKING_STATES.IS_EXTENSION_UPDATED];
    }

    return PROBLEM_STATES[NOT_WORKING_STATES.IS_RELOADING];
}

const AppClosed = observer(() => {
    const { requestsStore, settingsStore, uiStore } = useContext(rootStore);

    const {
        state, title, buttonText, updateStore,
    } = defineWarning(settingsStore);
    return (
        <div className="app-closed__wrapper">
            <div className="app-closed__status-wrapper">
                <header className="app-closed__status">{title}</header>
            </div>
            {(state !== NOT_WORKING_STATES.IS_RELOADING) && (
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
            )}
        </div>
    );
});

export default AppClosed;
