import { FEEDBACK_ACTIONS, POPUP_MESSAGES } from '../../lib/types';

const getMessageReceiver = (rootStore) => {
    const { settingsStore } = rootStore;

    return async (message) => {
        const { type, data } = message;

        switch (type) {
            case POPUP_MESSAGES.STATE_UPDATED:
                if (data.appState.feedbackAction === FEEDBACK_ACTIONS.UPDATE_FILTERING_STATUS) {
                    await settingsStore.updatePopupData();
                } else {
                    settingsStore.setCurrentAppState(data.appState);
                    settingsStore.setUpdateStatusInfo(data.updateStatusInfo);
                }
                break;
            case POPUP_MESSAGES.UPDATE_FILTERING_PAUSE_TIMEOUT: {
                const { currentTabHostname } = settingsStore;
                const filteringPauseTimeout = data.filteringPauseMap[currentTabHostname];

                if (filteringPauseTimeout === undefined) {
                    break;
                }

                if (filteringPauseTimeout >= 0) {
                    settingsStore.setFilteringPauseTimeout(filteringPauseTimeout);
                } else {
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
