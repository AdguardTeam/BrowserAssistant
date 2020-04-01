import { POPUP_MESSAGES } from '../../lib/types';

const getMessageHandler = (rootStore) => {
    const { settingsStore, uiStore } = rootStore;

    return async (message) => {
        const { type, data } = message;

        switch (type) {
            case POPUP_MESSAGES.SHOW_IS_NOT_INSTALLED:
                settingsStore.setInstalled(false);
                break;
            case POPUP_MESSAGES.START_RELOAD:
                uiStore.setExtensionLoading(true);
                return;
            case POPUP_MESSAGES.STATE_UPDATED:
                // TODO check which data is appearing here
                await settingsStore.setCurrentAppState(data);
                break;
            case POPUP_MESSAGES.STOP_RELOAD:
            default:
                break;
        }

        // TODO consider removing
        uiStore.setExtensionLoading(false);
        uiStore.setExtensionPending(false);
    };
};

export default getMessageHandler;
