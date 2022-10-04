import { FILTERING_PAUSE_VERSION_SUPPORT_SINCE } from '../lib/consts';
import { compareSemver, getUrlProperties } from '../lib/helpers';
import notifier from '../lib/notifier';
import { longLivedMessageService } from './longLivedMessageService';
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

    resetAllHostnameTimeout = () => {
        this.hostnameToTimeoutMap = Object.keys(this.hostnameToTimeoutMap)
            .reduce((acc, hostname) => {
                acc[hostname] = 0;
                return acc;
            }, {});
    };

    clearHostnameTimeout = async (url) => {
        this.resetHostnameTimeout(url);
        this.notifyPopup();
        this.deleteHostnameTimeout(url);
    };

    isFilteringPauseSupported = () => {
        const { version, platform } = state.hostInfo;
        if (!platform) {
            return false;
        }
        const minSupportVersion = FILTERING_PAUSE_VERSION_SUPPORT_SINCE[platform.toUpperCase()];
        return compareSemver(version, minSupportVersion) >= 0;
    };

    showReloadButtonFlag = (url) => {
        const timeout = this.getHostnameTimeout(url);

        if (timeout === undefined) {
            return false;
        }

        return timeout < 0;
    };

    notifyPopup = () => {
        longLivedMessageService.notifyPopupFilteringPauseTimeout(this.hostnameToTimeoutMap);
    };

    handleFilteringPause = async (url) => {
        if (!this.isFilteringPauseSupported()) {
            return;
        }

        this.setHostnameTimeout(url, FILTERING_PAUSE_TIMEOUT_MS);
        await state.pauseFiltering(url, (FILTERING_PAUSE_TIMEOUT_MS / 1000).toString());

        const timerId = setInterval(async () => {
            const timeout = this.getHostnameTimeout(url);

            if (timeout < 0) {
                // Notify to toggle the icon to the enabled state
                notifier.notifyListeners(notifier.types.STATE_UPDATED);
                clearTimeout(timerId);
            }

            if (timeout === undefined) {
                clearTimeout(timerId);
                return;
            }

            this.notifyPopup();

            this.setHostnameTimeout(url, timeout - FILTERING_PAUSE_TIMER_TICK_MS);
        }, FILTERING_PAUSE_TIMER_TICK_MS);
    };
}

const filteringPause = new FilteringPause();

export default filteringPause;
