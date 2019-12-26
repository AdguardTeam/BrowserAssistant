import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import rootStore from '../../../stores';
import './AppClosed.pcss';
import { WORKING_STATES } from '../../../stores/consts';
import Loading from '../../ui/Loading';

const STATES = {
    [WORKING_STATES.IS_APP_INSTALLED]: {
        state: WORKING_STATES.IS_APP_INSTALLED,
        content: 'AdGuard is not installed',
        buttonText: 'download',
        updateStore: ({ settingsStore }) => {
            settingsStore.openDownloadPage();
            window.close();
        },
    },

    [WORKING_STATES.IS_APP_UP_TO_DATE]: {
        state: WORKING_STATES.IS_APP_UP_TO_DATE,
        content: 'AdGuard is not updated',
        buttonText: 'update',
        updateStore: ({ requestsStore }) => {
            requestsStore.updateApp();
            window.close();
        },
    },

    [WORKING_STATES.IS_APP_RUNNING]: {
        state: WORKING_STATES.IS_APP_RUNNING,
        content: 'AdGuard is not running',
        buttonText: 'run adguard',
        updateStore: ({ requestsStore }) => requestsStore.startApp(),
    },

    [WORKING_STATES.IS_PROTECTION_ENABLED]: {
        state: WORKING_STATES.IS_PROTECTION_ENABLED,
        content: 'AdGuard protection is paused',
        buttonText: 'enable',
        updateStore: ({ requestsStore }) => requestsStore.setProtectionStatus(true),
    },

    [WORKING_STATES.IS_EXTENSION_UPDATED]: {
        state: WORKING_STATES.IS_EXTENSION_UPDATED,
        id: 'isExtensionNotUpdated',
        content: 'Assistant is not updated',
        buttonText: 'update',
        updateStore: ({ settingsStore }) => settingsStore.updateExtension(),
    },

    [WORKING_STATES.IS_EXTENSION_RELOADING]: {
        state: WORKING_STATES.IS_EXTENSION_RELOADING,
        content: <Loading />,
        buttonText: 'reloading...',
        updateStore: () => null,
    },

    [WORKING_STATES.IS_APP_SETUP_CORRECTLY]: {
        state: WORKING_STATES.IS_APP_SETUP_CORRECTLY,
        id: 'isBroken',
        content: 'Something went wrong',
        buttonText: 'reinstall',
        updateStore: ({ settingsStore }) => {
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
        return STATES[WORKING_STATES.IS_APP_SETUP_CORRECTLY];
    }

    if (!isInstalled) {
        return STATES[WORKING_STATES.IS_APP_INSTALLED];
    }

    if (!isRunning) {
        return STATES[WORKING_STATES.IS_APP_RUNNING];
    }

    if (!isProtectionEnabled) {
        return STATES[WORKING_STATES.IS_PROTECTION_ENABLED];
    }

    if (!isAppUpToDate) {
        return STATES[WORKING_STATES.IS_APP_UP_TO_DATE];
    }

    if (!isExtensionUpdated) {
        return STATES[WORKING_STATES.IS_EXTENSION_UPDATED];
    }

    return STATES[WORKING_STATES.IS_EXTENSION_RELOADING];
}

const AppClosed = observer(() => {
    const { requestsStore, settingsStore, uiStore } = useContext(rootStore);

    const {
        state, content, buttonText, updateStore,
    } = defineWarning(settingsStore);

    const stores = { requestsStore, settingsStore };

    const handleClick = (e) => {
        updateStore(stores);
        e.currentTarget.blur();
    };

    return (
        <div className="app-closed__wrapper">
            <div className="app-closed__status-wrapper">
                <header className="app-closed__status">{content}</header>
            </div>
            {(state !== WORKING_STATES.IS_EXTENSION_RELOADING) && (
                <button
                    className="app-closed__button"
                    type="button"
                    tabIndex={uiStore.globalTabIndex}
                    onClick={handleClick}
                >
                    {buttonText}
                </button>
            )}
        </div>
    );
});

export default AppClosed;
