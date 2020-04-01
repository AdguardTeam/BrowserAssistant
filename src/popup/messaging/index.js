import { MESSAGE_TYPES } from '../../lib/types';

const getMessageHandler = (rootStore) => {
    const { settingsStore, uiStore } = rootStore;

    return async (message) => {
        const { type, data } = message;

        switch (type) {
            case MESSAGE_TYPES.SHOW_IS_NOT_INSTALLED:
                settingsStore.setInstalled(false);
                break;
            case MESSAGE_TYPES.START_RELOAD:
                uiStore.setExtensionLoading(true);
                return;
            case MESSAGE_TYPES.STATE_UPDATED:
                // TODO check which data is appearing here
                await settingsStore.setCurrentAppState(data);
                break;
            case MESSAGE_TYPES.STOP_RELOAD:
            default:
                break;
        }

        uiStore.setExtensionLoading(false);
        uiStore.setExtensionPending(false);
    };
};

export default getMessageHandler;
