import state from './state';
import tabs from './tabs';
import filteringPause from './filteringPause';

const getPopupData = async (tab) => {
    try {
        await state.getCurrentAppState();
    } catch (e) {
        return {
            appState: state.getAppState(),
            updateStatusInfo: state.getUpdateStatusInfo(),
            hostError: e.message,
            isFilteringPauseSupported: filteringPause.isFilteringPauseSupported(),
            showReloadButtonFlag: filteringPause.showReloadButtonFlag(),
        };
    }

    // There is no need to check tab info if app is not working
    if (!state.isAppWorking()) {
        return {
            appState: state.getAppState(),
            updateStatusInfo: state.getUpdateStatusInfo(),
            isFilteringPauseSupported: filteringPause.isFilteringPauseSupported(),
            showReloadButtonFlag: filteringPause.showReloadButtonFlag(),
        };
    }

    const referrer = await tabs.getReferrer(tab);
    const updateStatusInfo = state.getUpdateStatusInfo();
    const appState = state.getAppState();
    let currentFilteringState;
    try {
        currentFilteringState = await state.getCurrentFilteringState(tab);
    } catch (e) {
        const updateStatusInfo = await state.getUpdateStatusInfo();
        const appState = await state.getAppState();
        return {
            referrer,
            updateStatusInfo,
            appState,
            hostError: e.message,
            isFilteringPauseSupported: filteringPause.isFilteringPauseSupported(),
            showReloadButtonFlag: filteringPause.showReloadButtonFlag(),
        };
    }

    // For pages without http or https currentFilteringState would be null
    if (!currentFilteringState) {
        const updateStatusInfo = await state.getUpdateStatusInfo();
        const appState = await state.getAppState();
        return {
            referrer,
            updateStatusInfo,
            appState,
            isFilteringPauseSupported: filteringPause.isFilteringPauseSupported(),
            showReloadButtonFlag: filteringPause.showReloadButtonFlag(),
        };
    }

    return {
        referrer,
        updateStatusInfo,
        appState,
        currentFilteringState,
        isFilteringPauseSupported: filteringPause.isFilteringPauseSupported(),
        showReloadButtonFlag: filteringPause.showReloadButtonFlag(),
    };
};

export default getPopupData;
