import { POPUP_MESSAGES } from '../../lib/types';

const getMessageReceiver = (rootStore) => {
    const { settingsStore } = rootStore;

    return async (message) => {
        const { type, data } = message;

        switch (type) {
            case POPUP_MESSAGES.STATE_UPDATED:
                settingsStore.setCurrentAppState(data.appState);
                settingsStore.setUpdateStatusInfo(data.updateStatusInfo);
                break;
            default:
                break;
        }
    };
};

export default getMessageReceiver;
