import state from './state';
import { FILTERING_PAUSE_TIMEOUT_MS, FILTERING_PAUSE_TIMER_TICK_MS } from '../lib/consts';
import tabs from './tabs';

const handleFilteringPause = async (tab, url) => {
    const {
        pauseFiltering,
        setFilteringPauseTimeout,
        updateFilteringPauseTimeout,
        setFilteringPauseUrl,
        getCurrentFilteringState,
        updateCurrentFilteringState,
        isFilteringPauseSupported,
    } = state;

    if (!isFilteringPauseSupported) {
        return;
    }

    setFilteringPauseUrl(url);
    setFilteringPauseTimeout(FILTERING_PAUSE_TIMEOUT_MS);
    await pauseFiltering(url, (FILTERING_PAUSE_TIMEOUT_MS / 1000).toString());
    await tabs.reload(tab);

    const timerId = setInterval(() => {
        if (state.filteringPauseTimeout < 0) {
            clearTimeout(timerId);

            tabs.reload(tab);

            getCurrentFilteringState(tab)
                .then(updateCurrentFilteringState);
            return;
        }

        updateFilteringPauseTimeout()
            .then(() => {
                setFilteringPauseTimeout(
                    state.filteringPauseTimeout - FILTERING_PAUSE_TIMER_TICK_MS
                );
            });
    }, FILTERING_PAUSE_TIMER_TICK_MS);
};

export default handleFilteringPause;
