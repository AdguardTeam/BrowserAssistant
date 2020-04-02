import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import rootStore from '../../../stores';
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
        hasHostError,
        openDownloadPage,
    } = settingsStore;

    const states = {
        ERROR_OCCURRED: {
            content: translate('something_went_wrong'),
            buttonText: translate('reinstall'),
            onClick: () => {
                openDownloadPage();
                window.close();
            },
        },
        APP_IS_NOT_INSTALLED: {
            content: translate('adg_is_not_installed'),
            buttonText: translate('get_adguard'),
            onClick: () => {
                settingsStore.openDownloadPage();
                window.close();
            },
        },
        APP_IS_NOT_UP_TO_DATE: {
            content: translate('adg_is_not_updated'),
            buttonText: translate('update'),
            onClick: () => {
                settingsStore.updateApp();
                window.close();
            },
        },
        APP_IS_NOT_RUNNING: {
            content: translate('adg_is_not_running'),
            buttonText: translate('run_adg'),
            onClick: settingsStore.startApp,
        },
        PROTECTION_IS_NOT_ENABLED: {
            content: translate('adg_is_paused'),
            buttonText: translate('enable'),
            onClick: async () => {
                await settingsStore.enableApp();
            },
        },
        EXTENSION_IS_NOT_UPDATED: {
            content: translate('assistant_is_not_updated'),
            buttonText: translate('update'),
            onClick: () => {
                settingsStore.updateExtension();
                window.close();
            },
        },
        EXTENSION_IS_RELOADING: {
            content: translate('adg_is_launching'),
        },
    };

    let state;
    if (uiStore.isLoading) {
        state = states.EXTENSION_IS_RELOADING;
    } else {
        switch (true) {
            case hasHostError:
                // state = states.ERROR_OCCURRED;
                state = states.APP_IS_NOT_INSTALLED;
                break;
            case !isValidatedOnHost:
                state = states.EXTENSION_IS_NOT_UPDATED;
                break;
            case !isAppUpToDate:
                state = states.APP_IS_NOT_UP_TO_DATE;
                break;
            case !isInstalled:
                state = states.APP_IS_NOT_INSTALLED;
                break;
            case !isRunning:
                state = states.APP_IS_NOT_RUNNING;
                break;
            case !isProtectionEnabled:
                state = states.PROTECTION_IS_NOT_ENABLED;
                break;
            default:
                state = states.EXTENSION_IS_RELOADING;
        }
    }

    const { content, buttonText, onClick } = state;

    const { globalTabIndex, isLoading } = uiStore;

    const buttonClass = classnames({
        'app-closed__button': true,
        'app-closed__button--transparent': isLoading,
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
            {buttonText && (
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
            )}
        </div>
    );
});

export default AppClosed;
