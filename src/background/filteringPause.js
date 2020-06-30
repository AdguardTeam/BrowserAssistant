import { FILTERING_PAUSE_VERSION_SUPPORT_SINCE } from '../lib/consts';
import { compareSemver, getUrlProperties } from '../lib/helpers';
import browserApi from '../lib/browserApi';
import { POPUP_MESSAGES } from '../lib/types';
import api from './api';
import state from './state';

const FILTERING_PAUSE_TIMEOUT_MS = 30000;
const FILTERING_PAUSE_TIMER_TICK_MS = 1000;

/**
 * Handles filtering pause after the popup button "Do not filter for 30 seconds" is clicked
 */
class FilteringPause {
    hostnameToTimeoutMap = {};

    getUrlHostname = (url) => {
        return getUrlProperties(url).hostname;
    };

    setHostnameTimeout = (url, timeout) => {
        const hostname = this.getUrlHostname(url);
        this.hostnameToTimeoutMap[hostname] = timeout;
    };

    getHostnameTimeout = (url) => {
        const hostname = this.getUrlHostname(url);
        return this.hostnameToTimeoutMap[hostname];
    };

    deleteHostnameTimeout = (url) => {
        const hostname = this.getUrlHostname(url);
        delete this.hostnameToTimeoutMap[hostname];
    };

    resetHostnameTimeout = (url) => {
        this.setHostnameTimeout(url, 0);
    };

    isFilteringPauseSupported = () => {
        const { version, platform } = state.hostInfo;
        const minSupportVersion = FILTERING_PAUSE_VERSION_SUPPORT_SINCE[platform.toUpperCase()];
        return compareSemver(version, minSupportVersion) >= 0;
    };

    showReloadButtonFlag = (url) => {
        const timeout = this.getHostnameTimeout(url) || 0;
        return timeout < 0;
    };

    updateFilteringPauseTimeout = async () => {
        await browserApi.runtime.sendMessage({
            type: POPUP_MESSAGES.UPDATE_FILTERING_PAUSE_TIMEOUT,
            data: {
                filteringPauseMap: this.hostnameToTimeoutMap,
            },
        });
    };

    pauseFiltering = async (url, timeout) => {
        const response = await api.pauseFiltering(url, timeout);
        state.setAppState(response.appState);
    };

    handleFilteringPause = async (url) => {
        if (!this.isFilteringPauseSupported()) {
            return;
        }

        this.setHostnameTimeout(url, FILTERING_PAUSE_TIMEOUT_MS);
        await this.pauseFiltering(url, (FILTERING_PAUSE_TIMEOUT_MS / 1000).toString());

        const timerId = setInterval(async () => {
            const timeout = this.getHostnameTimeout(url);

            if (timeout < 0) {
                clearTimeout(timerId);
            }

            await this.updateFilteringPauseTimeout();

            this.setHostnameTimeout(url, timeout - FILTERING_PAUSE_TIMER_TICK_MS);
        }, FILTERING_PAUSE_TIMER_TICK_MS);
    };
}

const filteringPause = new FilteringPause();

export default filteringPause;
