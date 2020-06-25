import state from './state';
import { FILTERING_PAUSE_TIMEOUT_MS, FILTERING_PAUSE_TIMER_TICK_MS } from '../lib/consts';
import tabs from './tabs';

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

    const timerId = setInterval(() => {
        const timeout = state.filteringPauseUrlToTimeoutMap[url];

        if (timeout < 0) {
            clearTimeout(timerId);
            delete state.filteringPauseUrlToTimeoutMap[url];
            state.updateShowReloadButtonFlag(true);
            return;
        }

        (async () => {
            if (Object.prototype.hasOwnProperty
                .call(filteringPauseUrlToTimeoutMap, state.currentUrl)) {
                await updateFilteringPauseTimeout();
            }
        })();

        setFilteringPauseTimeout(url, timeout - FILTERING_PAUSE_TIMER_TICK_MS);
    }, FILTERING_PAUSE_TIMER_TICK_MS);
};

export default handleFilteringPause;
