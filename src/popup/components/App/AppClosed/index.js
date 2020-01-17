import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import rootStore from '../../../stores';
import './AppClosed.pcss';
import { WORKING_STATES } from '../../../stores/consts';
import Loading from '../../ui/Loading';

const getStates = (stores) => {
    const {
        settingsStore: { openDownloadPage, updateExtension },
        requestsStore: { updateApp, startApp, setProtectionStatus },
    } = stores;

    return ({
        [WORKING_STATES.IS_APP_INSTALLED]: {
            state: WORKING_STATES.IS_APP_INSTALLED,
            content: 'AdGuard is not installed',
            buttonText: 'download',
            onClick: () => {
                openDownloadPage();
                window.close();
            },
        },

        [WORKING_STATES.IS_APP_UP_TO_DATE]: {
            state: WORKING_STATES.IS_APP_UP_TO_DATE,
            content: 'AdGuard is not updated',
            buttonText: 'update',
            onClick: () => {
                updateApp();
                window.close();
            },
        },

        [WORKING_STATES.IS_APP_RUNNING]: {
            state: WORKING_STATES.IS_APP_RUNNING,
            content: 'AdGuard is not running',
            buttonText: 'run adguard',
            onClick: startApp,
        },

        [WORKING_STATES.IS_PROTECTION_ENABLED]: {
            state: WORKING_STATES.IS_PROTECTION_ENABLED,
            content: 'AdGuard protection is paused',
            buttonText: 'enable',
            onClick: setProtectionStatus.bind(this, true),
        },

        [WORKING_STATES.IS_EXTENSION_UPDATED]: {
            state: WORKING_STATES.IS_EXTENSION_UPDATED,
            id: 'isExtensionNotUpdated',
            content: 'Assistant is not updated',
            buttonText: 'update',
            onClick: updateExtension,
        },

        [WORKING_STATES.IS_EXTENSION_RELOADING]: {
            state: WORKING_STATES.IS_EXTENSION_RELOADING,
            content: <Loading />,
            buttonText: 'reloading...',
            onClick: undefined,
        },

        [WORKING_STATES.IS_APP_SETUP_CORRECTLY]: {
            state: WORKING_STATES.IS_APP_SETUP_CORRECTLY,
            id: 'isBroken',
            content: 'Something went wrong',
            buttonText: 'reinstall',
            onClick: () => {
                openDownloadPage();
                window.close();
            },
        },
    });
};

function defineState(stores) {
    const states = getStates(stores);
    const {
        isInstalled,
        isRunning,
        isProtectionEnabled,
        isAppUpToDate,
        isExtensionUpdated,
        isSetupCorrectly,
    } = stores.settingsStore;

    if (!isInstalled) {
        return states[WORKING_STATES.IS_APP_INSTALLED];
    }

    if (!isSetupCorrectly) {
        return states[WORKING_STATES.IS_APP_SETUP_CORRECTLY];
    }

    if (!isRunning) {
        return states[WORKING_STATES.IS_APP_RUNNING];
    }

    if (!isProtectionEnabled) {
        return states[WORKING_STATES.IS_PROTECTION_ENABLED];
    }

    if (!isAppUpToDate) {
        return states[WORKING_STATES.IS_APP_UP_TO_DATE];
    }

    if (!isExtensionUpdated) {
        return states[WORKING_STATES.IS_EXTENSION_UPDATED];
    }

    return states[WORKING_STATES.IS_EXTENSION_RELOADING];
}

const AppClosed = observer(() => {
    const stores = useContext(rootStore);
    const {
        state, content, buttonText, onClick,
    } = defineState(stores);

    const handleClick = (e) => {
        e.target.blur();
        if (onClick) {
            onClick();
        }
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
                        tabIndex={stores.uiStore.globalTabIndex}
                        onClick={handleClick}
                    >
                        {buttonText}
                    </button>
                </div>
            )}
        </div>
    );
});

export default AppClosed;
