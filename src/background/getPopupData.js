import state from './state';
import { tabsService } from './TabsService';
import filteringPause from './filteringPause';

const getPopupData = async (tab) => {
    const { url } = tab;

    try {
        await state.getCurrentAppState();
    } catch (e) {
        return {
            appState: state.getAppState(),
            updateStatusInfo: state.getUpdateStatusInfo(),
            hostError: e.message,
            isFilteringPauseSupported: filteringPause.isFilteringPauseSupported(),
            showReloadButtonFlag: filteringPause.showReloadButtonFlag(url),
        };
    }

    // There is no need to check tab info if app is not working
    if (!state.isAppWorking()) {
        return {
            appState: state.getAppState(),
            updateStatusInfo: state.getUpdateStatusInfo(),
            isFilteringPauseSupported: filteringPause.isFilteringPauseSupported(),
            showReloadButtonFlag: filteringPause.showReloadButtonFlag(url),
        };
    }

    const referrer = await tabsService.getReferrer(tab);
    const updateStatusInfo = state.getUpdateStatusInfo();
    const appState = state.getAppState();
    let currentFilteringState;
    try {
        currentFilteringState = await state.getCurrentFilteringState(tab);
    } catch (e) {
        const updateStatusInfo = state.getUpdateStatusInfo();
        const appState = state.getAppState();
        return {
            referrer,
            updateStatusInfo,
            appState,
            hostError: e.message,
            isFilteringPauseSupported: filteringPause.isFilteringPauseSupported(),
            showReloadButtonFlag: filteringPause.showReloadButtonFlag(url),
        };
    }

    // For pages without http or https currentFilteringState would be null
    if (!currentFilteringState) {
        const updateStatusInfo = state.getUpdateStatusInfo();
        const appState = state.getAppState();
        return {
            referrer,
            updateStatusInfo,
            appState,
            isFilteringPauseSupported: filteringPause.isFilteringPauseSupported(),
            showReloadButtonFlag: filteringPause.showReloadButtonFlag(url),
        };
    }

    return {
        referrer,
        updateStatusInfo,
        appState,
        currentFilteringState,
        isFilteringPauseSupported: filteringPause.isFilteringPauseSupported(),
        showReloadButtonFlag: filteringPause.showReloadButtonFlag(url),
    };
};

export default getPopupData;
