import state from './state';
import { PAUSE_FILTERING_TIMEOUT_MS, PAUSE_FILTERING_TIMER_TICK_MS } from '../lib/consts';
import tabs from './tabs';

const handleFilteringPause = async (tab, url) => {
    const {
        setTemporarilyDisableFilteringTimeout,
        temporarilyDisableFiltering,
        updateTemporarilyDisableFilteringTimeout,
        getCurrentFilteringState,
        updateCurrentFilteringState,
        setPausedFilteringUrl,
        isFilteringPauseSupported,
    } = state;

    if (!isFilteringPauseSupported) {
        return;
    }

    setPausedFilteringUrl(url);
    setTemporarilyDisableFilteringTimeout(PAUSE_FILTERING_TIMEOUT_MS);
    await temporarilyDisableFiltering(url, (PAUSE_FILTERING_TIMEOUT_MS / 1000).toString());
    await tabs.reload(tab);

    const timerId = setInterval(() => {
        if (state.temporarilyDisableFilteringTimeout < 0) {
            clearTimeout(timerId);

            tabs.reload(tab);

            getCurrentFilteringState(tab)
                .then(updateCurrentFilteringState);
            return;
        }

        updateTemporarilyDisableFilteringTimeout()
            .then(() => {
                setTemporarilyDisableFilteringTimeout(
                    state.temporarilyDisableFilteringTimeout - PAUSE_FILTERING_TIMER_TICK_MS
                );
            });
    }, PAUSE_FILTERING_TIMER_TICK_MS);
};

export default handleFilteringPause;
