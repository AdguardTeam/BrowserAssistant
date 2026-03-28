import { log } from '../lib/logger';
import { getErrorMessage } from '../lib/errors';

import state from './state';
import { tabsService } from './TabsService';
import filteringPause from './filteringPause';

const APP_STATE_FETCH_RETRIES = 2;
const APP_STATE_RETRY_DELAY_MS = 400;
/** Prevents infinite popup loading if native messaging hangs (no manifest / dead port). */
const GET_APP_STATE_TIMEOUT_MS = 20000;

const sleep = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
});

const withTimeout = (promise, ms, timeoutMessage) => new Promise((resolve, reject) => {
    const t = setTimeout(() => {
        reject(new Error(timeoutMessage));
    }, ms);
    promise.then(
        (v) => {
            clearTimeout(t);
            resolve(v);
        },
        (e) => {
            clearTimeout(t);
            reject(e instanceof Error ? e : new Error(getErrorMessage(e)));
        },
    );
});

const NATIVE_HOST_TIMEOUT_HINT = 'AdGuard did not answer in time. On Mac, Firefox needs the native host file at '
    + '~/Library/Application Support/Mozilla/NativeMessagingHosts/com.adguard.browser_extension_host.nm.json '
    + '(created when AdGuard for Mac registers Browser Assistant for Firefox). Open AdGuard → Settings → '
    + 'Browser Assistant / integration and ensure Firefox is enabled, or reinstall AdGuard.';

const getPopupData = async (tab) => {
    const { url } = tab;

    try {
        let lastError;
        for (let attempt = 1; attempt <= APP_STATE_FETCH_RETRIES; attempt += 1) {
            try {
                // eslint-disable-next-line no-await-in-loop
                await withTimeout(
                    state.getCurrentAppState(),
                    GET_APP_STATE_TIMEOUT_MS,
                    NATIVE_HOST_TIMEOUT_HINT,
                );
                lastError = null;
                break;
            } catch (e) {
                lastError = e;
                log.warn(
                    `getCurrentAppState attempt ${attempt}/${APP_STATE_FETCH_RETRIES}:`,
                    getErrorMessage(e),
                );
                if (attempt < APP_STATE_FETCH_RETRIES) {
                    // eslint-disable-next-line no-await-in-loop
                    await sleep(APP_STATE_RETRY_DELAY_MS);
                }
            }
        }
        if (lastError) {
            const err = lastError instanceof Error
                ? lastError
                : new Error(getErrorMessage(lastError));
            throw err;
        }
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
