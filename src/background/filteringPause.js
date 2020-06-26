import { FILTERING_PAUSE_VERSION_SUPPORT_SINCE } from '../lib/consts';
import { compareSemver } from '../lib/helpers';
import browserApi from '../lib/browserApi';
import { POPUP_MESSAGES } from '../lib/types';
import api from './api';
import tabs from './tabs';
import state from './state';

const FILTERING_PAUSE_TIMEOUT_MS = 30000;
const FILTERING_PAUSE_TIMER_TICK_MS = 1000;

class FilteringPause {
    filteringPauseUrlToTimeoutMap = {};

    showReloadButtonFlagMap = {};

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

    showReloadButtonFlag = () => {
        return this.showReloadButtonFlagMap[state.currentUrl];
    };

    updateFilteringPauseTimeout = async (url) => {
        await browserApi.runtime.sendMessage({
            type: POPUP_MESSAGES.UPDATE_FILTERING_PAUSE_TIMEOUT,
            data: {
                filteringPauseTimeout: this.filteringPauseUrlToTimeoutMap[url],
                filteringPauseUrl: url,
            },
        });
    };

    updateShowReloadButtonFlag = async (url, showReloadButtonFlag) => {
        this.showReloadButtonFlagMap[url] = showReloadButtonFlag;
        await browserApi.runtime.sendMessage({
            type: POPUP_MESSAGES.SHOW_RELOAD_BUTTON_FLAG,
            data: {
                showReloadButtonFlag,
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
                delete this.filteringPauseUrlToTimeoutMap[url];
                await this.updateShowReloadButtonFlag(url, true);
                return;
            }

            if (url === state.currentUrl) {
                await this.updateFilteringPauseTimeout(url);
            }

            this.setFilteringPauseTimeout(url, timeout - FILTERING_PAUSE_TIMER_TICK_MS);
        }, FILTERING_PAUSE_TIMER_TICK_MS);
    }
}

const filteringPause = new FilteringPause();

export default filteringPause;
