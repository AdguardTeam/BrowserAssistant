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
            case POPUP_MESSAGES.UPDATE_FILTERING_PAUSE_TIMEOUT: {
                const { currentUrl } = settingsStore;
                const filteringPauseTimeout = data.filteringPauseUrlToTimeoutMap[currentUrl];

                settingsStore.setFilteringPauseUrl(currentUrl);
                settingsStore.setFilteringPauseTimeout(filteringPauseTimeout);
                if (data.filteringPauseTimeout < 0) {
                    await settingsStore.updatePopupData();
                }
                break;
            }
            default:
                break;
        }
    };
};

export default getMessageReceiver;
