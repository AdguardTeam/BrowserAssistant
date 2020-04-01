import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import rootStore from '../../../stores';
import { WORKING_STATES } from '../../../stores/consts';
import Loading from '../../ui/Loading';
import './AppClosed.pcss';

const AppClosed = observer(() => {
    const { settingsStore, translationStore, uiStore } = useContext(rootStore);

    const { translate } = translationStore;

    const {
        isInstalled,
        isRunning,
        isProtectionEnabled,
        isAppUpToDate,
        isValidatedOnHost,
    } = settingsStore;

    const states = {
        [WORKING_STATES.IS_APP_INSTALLED]: {
            content: translate('adg_is_not_installed'),
            buttonText: translate('get_adguard'),
            onClick: () => {
                settingsStore.openDownloadPage();
                window.close();
            },
        },

        [WORKING_STATES.IS_APP_UP_TO_DATE]: {
            content: translate('adg_is_not_updated'),
            buttonText: translate('update'),
            onClick: async () => {
                await settingsStore.updateApp();
                window.close();
            },
        },

        [WORKING_STATES.IS_APP_RUNNING]: {
            content: translate('adg_is_not_running'),
            buttonText: translate('run_adg'),
            onClick: settingsStore.startApp,
        },

        [WORKING_STATES.IS_PROTECTION_ENABLED]: {
            content: translate('adg_is_paused'),
            buttonText: translate('enable'),
            onClick: async () => {
                await settingsStore.enableApp();
            },
        },

        [WORKING_STATES.IS_EXTENSION_UPDATED]: {
            content: translate('assistant_is_not_updated'),
            buttonText: translate('update'),
            onClick: settingsStore.updateExtension,
        },

        [WORKING_STATES.IS_EXTENSION_RELOADING]: {
            content: translate('adg_is_launching'),
            buttonText: <Loading />,
            onClick: undefined,
        },
    };

    let state;
    switch (true) {
        case !isInstalled:
            state = states[WORKING_STATES.IS_APP_INSTALLED];
            break;
        case !isRunning:
            state = states[WORKING_STATES.IS_APP_RUNNING];
            break;
        case !isProtectionEnabled:
            state = states[WORKING_STATES.IS_PROTECTION_ENABLED];
            break;
        case !isAppUpToDate:
            state = states[WORKING_STATES.IS_APP_UP_TO_DATE];
            break;
        case !isValidatedOnHost:
            state = states[WORKING_STATES.IS_EXTENSION_UPDATED];
            break;
        default:
            state = states[WORKING_STATES.IS_EXTENSION_RELOADING];
    }

    const { content, buttonText, onClick } = state;

    const { requestStatus, globalTabIndex } = uiStore;

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
