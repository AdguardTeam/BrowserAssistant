import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import rootStore from '../../../stores';
import './AppClosed.pcss';
import { APP_WORKING_PROBLEMS } from '../../../stores/consts';
import Loading from '../../ui/Loading';

const PROBLEM_STATES = {
    [APP_WORKING_PROBLEMS.IS_INSTALLED]: {
        state: APP_WORKING_PROBLEMS.IS_INSTALLED,
        content: 'AdGuard is not installed',
        buttonText: 'download',
        updateStore: (settingsStore) => {
            settingsStore.openDownloadPage();
            window.close();
        },
    },

    [APP_WORKING_PROBLEMS.IS_APP_UP_TO_DATE]: {
        state: APP_WORKING_PROBLEMS.IS_APP_UP_TO_DATE,
        content: 'AdGuard is not updated',
        buttonText: 'update',
        updateStore: (settingsStore, requestsStore) => {
            requestsStore.updateApp();
            window.close();
        },
    },

    [APP_WORKING_PROBLEMS.IS_RUNNING]: {
        state: APP_WORKING_PROBLEMS.IS_RUNNING,
        content: 'AdGuard is not running',
        buttonText: 'run adguard',
        updateStore: (settingsStore, requestsStore) => requestsStore.startApp(),
    },

    [APP_WORKING_PROBLEMS.IS_PROTECTION_ENABLED]: {
        state: APP_WORKING_PROBLEMS.IS_PROTECTION_ENABLED,
        content: 'AdGuard protection is paused',
        buttonText: 'enable',
        updateStore: settingsStore => settingsStore.toggleProtection(),
    },

    [APP_WORKING_PROBLEMS.IS_EXTENSION_UPDATED]: {
        state: APP_WORKING_PROBLEMS.IS_EXTENSION_UPDATED,
        id: 'isExtensionNotUpdated',
        content: 'Assistant is not updated',
        buttonText: 'update',
        updateStore: settingsStore => settingsStore.updateExtension(),
    },

    [APP_WORKING_PROBLEMS.IS_RELOADING]: {
        state: APP_WORKING_PROBLEMS.IS_RELOADING,
        content: <Loading />,
        buttonText: 'reloading...',
        updateStore: () => null,
    },

    [APP_WORKING_PROBLEMS.IS_SETUP_CORRECTLY]: {
        state: APP_WORKING_PROBLEMS.IS_SETUP_CORRECTLY,
        id: 'isBroken',
        content: 'Something went wrong',
        buttonText: 'reinstall',
        updateStore: (settingsStore) => {
            settingsStore.openDownloadPage();
            window.close();
        },
    },
};

function defineWarning(settingsStore) {
    const {
        isInstalled,
        isRunning,
        isProtectionEnabled,
        isAppUpToDate,
        isExtensionUpdated,
        isSetupCorrectly,
    } = settingsStore;

    if (!isSetupCorrectly) {
        return PROBLEM_STATES[APP_WORKING_PROBLEMS.IS_SETUP_CORRECTLY];
    }

    if (!isInstalled) {
        return PROBLEM_STATES[APP_WORKING_PROBLEMS.IS_INSTALLED];
    }

    if (!isRunning) {
        return PROBLEM_STATES[APP_WORKING_PROBLEMS.IS_RUNNING];
    }

    if (!isProtectionEnabled) {
        return PROBLEM_STATES[APP_WORKING_PROBLEMS.IS_PROTECTION_ENABLED];
    }

    if (!isAppUpToDate) {
        return PROBLEM_STATES[APP_WORKING_PROBLEMS.IS_APP_UP_TO_DATE];
    }

    if (!isExtensionUpdated) {
        return PROBLEM_STATES[APP_WORKING_PROBLEMS.IS_EXTENSION_UPDATED];
    }

    return PROBLEM_STATES[APP_WORKING_PROBLEMS.IS_RELOADING];
}

const AppClosed = observer(() => {
    const { requestsStore, settingsStore, uiStore } = useContext(rootStore);

    const {
        state, content, buttonText, updateStore,
    } = defineWarning(settingsStore);
    return (
        <div className="app-closed__wrapper">
            <div className="app-closed__status-wrapper">
                <header className="app-closed__status">{content}</header>
            </div>
            {(state !== APP_WORKING_PROBLEMS.IS_RELOADING) && (
                <button
                    className="app-closed__button"
                    type="button"
                    onClick={() => {
                        updateStore(settingsStore, requestsStore);
                        uiStore.setAppWorkingStatus();
                    }}
                >
                    {buttonText}
                </button>
            )}
            {state === APP_WORKING_PROBLEMS.IS_RUNNING && uiStore.isReloading && <Loading />}
        </div>
    );
});

export default AppClosed;
