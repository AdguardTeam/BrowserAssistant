import { FEEDBACK_ACTIONS, POPUP_MESSAGES } from '../../lib/types';

const getMessageReceiver = (rootStore) => {
    const { settingsStore } = rootStore;

    return async (message) => {
        const { type, data } = message;

        switch (type) {
            case POPUP_MESSAGES.STATE_UPDATED:
                // TODO move back feedbackAction check for updatePopupData
                //  when windows and mac apps will release new feedbackActions
                await settingsStore.updatePopupData();
                if (data.appState.feedbackAction === FEEDBACK_ACTIONS.UPDATE_APPLICATION_APP_ONLY) {
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
