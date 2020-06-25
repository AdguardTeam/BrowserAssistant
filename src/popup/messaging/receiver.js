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
                settingsStore.setFilteringPauseTimeout(data.temporarilyDisableFilteringTimeout);
                settingsStore.setPausedFilteringUrl(data.pausedFilteringUrl);
                break;
            case POPUP_MESSAGES.UPDATE_CURRENT_FILTERING_STATE:
                settingsStore.setUrlFilteringState(data.currentFilteringState);
                break;
            default:
                break;
        }
    };
};

export default getMessageReceiver;
