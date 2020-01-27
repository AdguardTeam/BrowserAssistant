import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import rootStore from '../../../stores';
import './AppClosed.pcss';
import { WORKING_STATES } from '../../../stores/consts';
import Loading from '../../ui/Loading';
import translator from '../../../../lib/translator';

const getStates = () => ({
    [WORKING_STATES.IS_APP_INSTALLED]: {
        state: WORKING_STATES.IS_APP_INSTALLED,
        content: translator.translate('adg_is_not_installed'),
        buttonText: translator.translate('download'),
        updateStore: ({ settingsStore }) => {
            settingsStore.openDownloadPage();
            window.close();
        },
    },

    [WORKING_STATES.IS_APP_UP_TO_DATE]: {
        state: WORKING_STATES.IS_APP_UP_TO_DATE,
        content: translator.translate('adg_is_not_updated'),
        buttonText: translator.translate('update'),
        updateStore: ({ requestsStore }) => {
            requestsStore.updateApp();
            window.close();
        },
    },

    [WORKING_STATES.IS_APP_RUNNING]: {
        state: WORKING_STATES.IS_APP_RUNNING,
        content: translator.translate('adg_is_not_running'),
        buttonText: translator.translate('run_adg'),
        updateStore: ({ requestsStore }) => requestsStore.startApp(),
    },

    [WORKING_STATES.IS_PROTECTION_ENABLED]: {
        state: WORKING_STATES.IS_PROTECTION_ENABLED,
        content: translator.translate('adg_is_paused'),
        buttonText: translator.translate('enable'),
        updateStore: ({ requestsStore }) => requestsStore.setProtectionStatus(true),
    },

    [WORKING_STATES.IS_EXTENSION_UPDATED]: {
        state: WORKING_STATES.IS_EXTENSION_UPDATED,
        content: translator.translate('assistant_is_not_updated'),
        buttonText: translator.translate('update'),
        updateStore: ({ settingsStore }) => settingsStore.updateExtension(),
    },

    [WORKING_STATES.IS_EXTENSION_RELOADING]: {
        state: WORKING_STATES.IS_EXTENSION_RELOADING,
        content: <Loading />,
        buttonText: translator.translate('reloading'),
        updateStore: () => null,
    },

    [WORKING_STATES.IS_APP_SETUP_CORRECTLY]: {
        state: WORKING_STATES.IS_APP_SETUP_CORRECTLY,
        content: translator.translate('something_went_wrong'),
        buttonText: translator.translate('reinstall'),
        updateStore: ({ settingsStore }) => {
            settingsStore.openDownloadPage();
            window.close();
        },
    },
});

function defineWarning(settingsStore) {
    const {
        isInstalled,
        isRunning,
        isProtectionEnabled,
        isAppUpToDate,
        isExtensionUpdated,
        isSetupCorrectly,
    } = settingsStore;

    const STATES = getStates();

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

    const {
        state, content, buttonText, updateStore,
    } = defineWarning(settingsStore);

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
