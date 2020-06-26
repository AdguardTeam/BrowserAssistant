import state from './state';
import tabs from './tabs';

const FILTERING_PAUSE_TIMEOUT_MS = 30000;
const FILTERING_PAUSE_TIMER_TICK_MS = 1000;

const handleFilteringPause = async (tab, url) => {
    const {
        pauseFiltering,
        setFilteringPauseTimeout,
        updateFilteringPauseTimeout,
        isFilteringPauseSupported,
        filteringPauseUrlToTimeoutMap,
    } = state;

    if (!isFilteringPauseSupported) {
        return;
    }

    setFilteringPauseTimeout(url, FILTERING_PAUSE_TIMEOUT_MS);
    await pauseFiltering(url, (FILTERING_PAUSE_TIMEOUT_MS / 1000).toString());
    await tabs.reload(tab);

    const timerId = setInterval(async () => {
        const timeout = state.filteringPauseUrlToTimeoutMap[url];

        if (timeout < 0) {
            clearTimeout(timerId);
            delete state.filteringPauseUrlToTimeoutMap[url];
            await state.updateShowReloadButtonFlag(true);
            return;
        }

        if (Object.prototype.hasOwnProperty
            .call(filteringPauseUrlToTimeoutMap, state.currentUrl)) {
            await updateFilteringPauseTimeout();
        }

        setFilteringPauseTimeout(url, timeout - FILTERING_PAUSE_TIMER_TICK_MS);
    }, FILTERING_PAUSE_TIMER_TICK_MS);
};

export default handleFilteringPause;
