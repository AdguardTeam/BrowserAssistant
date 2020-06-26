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
            case POPUP_MESSAGES.UPDATE_FILTERING_PAUSE_TIMEOUT:
                settingsStore.setFilteringPauseUrl(data.filteringPauseUrl);
                settingsStore.setFilteringPauseTimeout(data.filteringPauseTimeout);
                if (data.filteringPauseTimeout < 0) {
                    await settingsStore.updatePopupData();
                }
                break;
            default:
                break;
        }
    };
};

export default getMessageReceiver;
