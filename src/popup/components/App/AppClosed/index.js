import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { useIntl } from 'react-intl';
import rootStore from '../../../stores';
import './AppClosed.pcss';
import { WORKING_STATES } from '../../../stores/consts';
import Loading from '../../ui/Loading';

const getStates = f => ({
    [WORKING_STATES.IS_APP_INSTALLED]: {
        state: WORKING_STATES.IS_APP_INSTALLED,
        content: f({ id: 'adg_is_not_installed' }),
        buttonText: f({ id: 'download' }),
        updateStore: ({ settingsStore }) => {
            settingsStore.openDownloadPage();
            window.close();
        },
    },

    [WORKING_STATES.IS_APP_UP_TO_DATE]: {
        state: WORKING_STATES.IS_APP_UP_TO_DATE,
        content: f({ id: 'adg_is_not_updated' }),
        buttonText: f({ id: 'update' }),
        updateStore: ({ requestsStore }) => {
            requestsStore.updateApp();
            window.close();
        },
    },

    [WORKING_STATES.IS_APP_RUNNING]: {
        state: WORKING_STATES.IS_APP_RUNNING,
        content: f({ id: 'adg_is_not_running' }),
        buttonText: f({ id: 'run_adg' }),
        updateStore: ({ requestsStore }) => requestsStore.startApp(),
    },

    [WORKING_STATES.IS_PROTECTION_ENABLED]: {
        state: WORKING_STATES.IS_PROTECTION_ENABLED,
        content: f({ id: 'adg_is_paused' }),
        buttonText: f({ id: 'enable' }),
        updateStore: ({ requestsStore }) => requestsStore.setProtectionStatus(true),
    },

    [WORKING_STATES.IS_EXTENSION_UPDATED]: {
        state: WORKING_STATES.IS_EXTENSION_UPDATED,
        content: f({ id: 'assistant_is_not_updated' }),
        buttonText: f({ id: 'update' }),
        updateStore: ({ settingsStore }) => settingsStore.updateExtension(),
    },

    [WORKING_STATES.IS_EXTENSION_RELOADING]: {
        state: WORKING_STATES.IS_EXTENSION_RELOADING,
        content: <Loading />,
        buttonText: f({ id: 'reloading' }),
        updateStore: () => null,
    },

    [WORKING_STATES.IS_APP_SETUP_CORRECTLY]: {
        state: WORKING_STATES.IS_APP_SETUP_CORRECTLY,
        content: f({ id: 'something_went_wrong' }),
        buttonText: f({ id: 'reinstall' }),
        updateStore: ({ settingsStore }) => {
            settingsStore.openDownloadPage();
            window.close();
        },
    },
});

function defineWarning(settingsStore, f) {
    const {
        isInstalled,
        isRunning,
        isProtectionEnabled,
        isAppUpToDate,
        isExtensionUpdated,
        isSetupCorrectly,
    } = settingsStore;

    const STATES = getStates(f);

    if (!isInstalled || !isSetupCorrectly) {
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
    const { formatMessage: f } = useIntl();

    const {
        state, content, buttonText, updateStore,
    } = defineWarning(settingsStore, f);

    const stores = { requestsStore, settingsStore };

    const onClick = (e) => {
        updateStore(stores);
        e.target.blur();
    };

    return (
        <div className="app-closed__container">
            <div className="app-closed__status-container">
                <header className="app-closed__status">{content}</header>
            </div>
            {(state !== WORKING_STATES.IS_EXTENSION_RELOADING) && (
                <div>
                    <button
                        className="app-closed__button"
                        type="button"
                        tabIndex={uiStore.globalTabIndex}
                        onClick={onClick}
                    >
                        {buttonText}
                    </button>
                </div>
            )}
        </div>
    );
});

export default AppClosed;
