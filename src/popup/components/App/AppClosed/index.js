import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import rootStore from '../../../stores';
import './AppClosed.pcss';
import ClosedApp from './ClosedApp';

const AppClosed = observer(() => {
    const { settingsStore, uiStore } = useContext(rootStore);

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
            content: 'something_went_wrong',
            buttonText: 'reinstall',
            onClick: () => {
                openDownloadPage();
                window.close();
            },
        },
        APP_IS_NOT_INSTALLED: {
            content: 'adg_is_not_installed',
            buttonText: 'get_adguard',
            onClick: () => {
                settingsStore.openDownloadPage();
                window.close();
            },
        },
        APP_IS_NOT_UP_TO_DATE: {
            content: 'adg_is_not_updated',
            buttonText: 'update',
            onClick: () => {
                settingsStore.updateApp();
                window.close();
            },
        },
        APP_IS_NOT_RUNNING: {
            content: 'adg_is_not_running',
            buttonText: 'run_adg',
            onClick: settingsStore.startApp,
        },
        PROTECTION_IS_NOT_ENABLED: {
            content: 'adg_is_paused',
            buttonText: 'enable',
            onClick: async () => {
                await settingsStore.setProtectionStatus(true);
            },
        },
        EXTENSION_IS_NOT_UPDATED: {
            content: 'assistant_is_not_updated',
            buttonText: 'update',
            onClick: () => {
                settingsStore.updateExtension();
                window.close();
            },
        },
        EXTENSION_IS_RELOADING: {
            content: 'adg_is_launching',
        },
    };

    let state;
    if (uiStore.isLoading) {
        state = states.EXTENSION_IS_RELOADING;
    } else {
        switch (true) {
            case hasHostError:
            case !isInstalled:
                state = states.APP_IS_NOT_INSTALLED;
                break;
            case !isValidatedOnHost:
                state = states.EXTENSION_IS_NOT_UPDATED;
                break;
            case !isAppUpToDate:
                state = states.APP_IS_NOT_UP_TO_DATE;
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

    return (
        <ClosedApp
            isLoading={isLoading}
            content={content}
            buttonText={buttonText}
            globalTabIndex={globalTabIndex}
            onClick={onClick}
        />
    );
});

export default AppClosed;
