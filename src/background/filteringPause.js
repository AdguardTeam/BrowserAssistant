import { FILTERING_PAUSE_VERSION_SUPPORT_SINCE } from '../lib/consts';
import { compareSemver } from '../lib/helpers';
import browserApi from '../lib/browserApi';
import { POPUP_MESSAGES } from '../lib/types';
import api from './api';
import tabs from './tabs';
import state from './state';

const FILTERING_PAUSE_TIMEOUT_MS = 30000;
const FILTERING_PAUSE_TIMER_TICK_MS = 1000;

/**
 * Handles filtering pause after the popup button "Do not filter for 30 seconds" is clicked
 */
class FilteringPause {
    filteringPauseUrlToTimeoutMap = {};

    setFilteringPauseTimeout = (url, timeout) => {
        this.filteringPauseUrlToTimeoutMap[url] = timeout;
    };

    resetFilteringPauseTimeout = (url) => {
        this.setFilteringPauseTimeout(url, 0);
    };

    isFilteringPauseSupported = () => {
        const { version, platform } = state.hostInfo;
        const minSupportVersion = FILTERING_PAUSE_VERSION_SUPPORT_SINCE[platform.toUpperCase()];
        return compareSemver(version, minSupportVersion) >= 0;
    };

    showReloadButtonFlag = (url) => {
        return this.filteringPauseUrlToTimeoutMap[url] < 0;
    };

    updateFilteringPauseTimeout = async () => {
        await browserApi.runtime.sendMessage({
            type: POPUP_MESSAGES.UPDATE_FILTERING_PAUSE_TIMEOUT,
            data: {
                filteringPauseUrlToTimeoutMap: this.filteringPauseUrlToTimeoutMap,
            },
        });
    };

    pauseFiltering = async (url, timeout) => {
        const response = await api.pauseFiltering(url, timeout);
        state.setAppState(response.appState);
    };

    handleFilteringPause = async (tab) => {
        const { url } = tab;
        if (!this.isFilteringPauseSupported()) {
            return;
        }

        this.setFilteringPauseTimeout(url, FILTERING_PAUSE_TIMEOUT_MS);
        await this.pauseFiltering(url, (FILTERING_PAUSE_TIMEOUT_MS / 1000).toString());
        await tabs.reload(tab);

        const timerId = setInterval(async () => {
            const timeout = this.filteringPauseUrlToTimeoutMap[url];

            if (timeout < 0) {
                clearTimeout(timerId);
            }

            await this.updateFilteringPauseTimeout();

            this.setFilteringPauseTimeout(url, timeout - FILTERING_PAUSE_TIMER_TICK_MS);
        }, FILTERING_PAUSE_TIMER_TICK_MS);
    }
}

const filteringPause = new FilteringPause();

export default filteringPause;
