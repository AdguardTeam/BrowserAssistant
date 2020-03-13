import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import rootStore from '../../../stores';
import { WORKING_STATES } from '../../../stores/consts';
import Loading from '../../ui/Loading';
import './AppClosed.pcss';

const getStates = (stores) => {
    const {
        settingsStore: {
            openDownloadPage, updateExtension,
        },
        requestsStore: {
            updateApp, startApp, setProtectionStatus, getCurrentFilteringState,
        },
        translationStore: { translate },
    } = stores;

    return ({
        [WORKING_STATES.IS_APP_INSTALLED]: {
            content: translate('adg_is_not_installed'),
            buttonText: translate('get_adguard'),
            onClick: () => {
                openDownloadPage();
                window.close();
            },
        },

        [WORKING_STATES.IS_APP_UP_TO_DATE]: {
            content: translate('adg_is_not_updated'),
            buttonText: translate('update'),
            onClick: () => {
                updateApp();
                window.close();
            },
        },

        [WORKING_STATES.IS_APP_RUNNING]: {
            content: translate('adg_is_not_running'),
            buttonText: translate('run_adg'),
            onClick: startApp,
        },

        [WORKING_STATES.IS_PROTECTION_ENABLED]: {
            content: translate('adg_is_paused'),
            buttonText: translate('enable'),
            onClick: async () => {
                setProtectionStatus(true);
                await getCurrentFilteringState();
            },
        },

        [WORKING_STATES.IS_EXTENSION_UPDATED]: {
            content: translate('assistant_is_not_updated'),
            buttonText: translate('update'),
            onClick: updateExtension,
        },

        [WORKING_STATES.IS_EXTENSION_RELOADING]: {
            content: translate('adg_is_launching'),
            buttonText: <Loading />,
            onClick: undefined,
        },

        [WORKING_STATES.IS_APP_SETUP_CORRECT]: {
            content: translate('something_went_wrong'),
            buttonText: translate('reinstall'),
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
        isSetupCorrect,
    } = stores.settingsStore;

    if (!isInstalled) {
        return states[WORKING_STATES.IS_APP_INSTALLED];
    }

    if (!isSetupCorrect) {
        return states[WORKING_STATES.IS_APP_SETUP_CORRECT];
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
    const { content, buttonText, onClick } = defineState(stores);
    const {
        uiStore: { requestStatus, globalTabIndex },
    } = stores;

    const buttonClass = classnames({
        'app-closed__button': true,
        'app-closed__button--transparent': requestStatus.isPending,
    });

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
            <div>
                <button
                    className={buttonClass}
                    type="button"
                    tabIndex={globalTabIndex}
                    onClick={handleClick}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
});

export default AppClosed;
