import { POPUP_MESSAGES } from '../../lib/types';

const getMessageReceiver = (rootStore) => {
    const { settingsStore } = rootStore;

    return (message) => {
        const { type, data } = message;

        switch (type) {
            case POPUP_MESSAGES.STATE_UPDATED:
                settingsStore.setCurrentAppState(data.appState);
                settingsStore.setUpdateStatusInfo(data.updateStatusInfo);
                break;
            case POPUP_MESSAGES.UPDATE_FILTERING_PAUSE_TIMEOUT:
                settingsStore.setFilteringPauseUrl(data.filteringPauseUrl);
                settingsStore.setFilteringPauseTimeout(data.filteringPauseTimeout);
                break;
            case POPUP_MESSAGES.SHOW_RELOAD_BUTTON_FLAG:
                settingsStore.setShowReloadButtonFlag(data.showReloadButtonFlag);
                break;
            default:
                break;
        }
    };
};

export default getMessageReceiver;
