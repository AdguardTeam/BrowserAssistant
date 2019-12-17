import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import rootStore from '../../../stores';
import './AppClosed.pcss';
import { NOT_WORKING_STATES } from '../../../stores/consts';
import Loading from '../../ui/Loading';

const PROBLEM_STATES = {
    [NOT_WORKING_STATES.IS_INSTALLED]: {
        state: NOT_WORKING_STATES.IS_INSTALLED,
        content: 'AdGuard is not installed',
        buttonText: 'download',
        updateStore: (settingsStore) => {
            settingsStore.openDownloadPage();
            window.close();
        },
    },

    [NOT_WORKING_STATES.IS_APP_UP_TO_DATE]: {
        state: NOT_WORKING_STATES.IS_APP_UP_TO_DATE,
        content: 'AdGuard is not updated',
        buttonText: 'update',
        updateStore: (settingsStore, requestsStore) => {
            requestsStore.updateApp();
            window.close();
        },
    },

    [NOT_WORKING_STATES.IS_RUNNING]: {
        state: NOT_WORKING_STATES.IS_RUNNING,
        content: 'AdGuard is not running',
        buttonText: 'run adguard',
        updateStore: (settingsStore, requestsStore) => requestsStore.startApp(),
    },

    [NOT_WORKING_STATES.IS_PROTECTION_ENABLED]: {
        state: NOT_WORKING_STATES.IS_PROTECTION_ENABLED,
        content: 'AdGuard protection is paused',
        buttonText: 'enable',
        updateStore: settingsStore => settingsStore.toggleProtection(),
    },

    [NOT_WORKING_STATES.IS_EXTENSION_UPDATED]: {
        state: NOT_WORKING_STATES.IS_EXTENSION_UPDATED,
        id: 'isExtensionNotUpdated',
        content: 'Assistant is not updated',
        buttonText: 'update',
        updateStore: settingsStore => settingsStore.updateExtension(),
    },

    [NOT_WORKING_STATES.IS_RELOADING]: {
        state: NOT_WORKING_STATES.IS_RELOADING,
        content: <Loading />,
        buttonText: 'reloading...',
        updateStore: () => null,
    },

    [NOT_WORKING_STATES.IS_SETUP_CORRECTLY]: {
        state: NOT_WORKING_STATES.IS_SETUP_CORRECTLY,
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
        return PROBLEM_STATES[NOT_WORKING_STATES.IS_SETUP_CORRECTLY];
    }

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
        state, content, buttonText, updateStore,
    } = defineWarning(settingsStore);
    return (
        <div className="app-closed__wrapper">
            <div className="app-closed__status-wrapper">
                <header className="app-closed__status">{content}</header>
            </div>
            {(state !== NOT_WORKING_STATES.IS_RELOADING) && (
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
            {state === NOT_WORKING_STATES.IS_RUNNING && uiStore.isReloading && <Loading />}
        </div>
    );
});

export default AppClosed;
