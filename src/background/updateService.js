import browser from 'webextension-polyfill';

import { storage } from './storage';
import log from '../lib/logger';
import { APP_VERSION_KEY } from '../lib/types';
import { localStorage } from './localStorage';

/**
 * Service with data about current app state
 */
class UpdateService {
    WAIT_FROM_INSTALLED_EVENT_TIMEOUT_MS = 50;

    /**
     * onInstalled doesn't fire event on reload from developers tools
     * that is why we use fallback from storage
     */
    getVersionsFromInstalledEvent = async () => {
        return new Promise((resolve) => {
            browser.runtime.onInstalled.addListener((details) => {
                const currentVersion = this.getAppVersionFromManifest();
                const { previousVersion } = details;
                resolve({
                    currentVersion,
                    previousVersion,
                });
            });
            setTimeout(() => {
                resolve(null);
            }, this.WAIT_FROM_INSTALLED_EVENT_TIMEOUT_MS);
        });
    };

    getVersionInfoFromStorage = async () => {
        const previousVersion = await this.getAppVersionFromStorage();
        const currentVersion = this.getAppVersionFromManifest();
        return {
            currentVersion,
            previousVersion,
        };
    };

    init = async (onInstalled) => {
        let versions = await this.getVersionsFromInstalledEvent();
        if (!versions) {
            versions = await this.getVersionInfoFromStorage();
            log.debug('Versions retrieved from storage', versions);
        } else {
            log.debug('Versions retrieved from installed event', versions);
        }

        this.currentVersion = versions.currentVersion;
        this.previousVersion = versions.previousVersion;

        this.isFirstRun = (this.currentVersion !== this.previousVersion && !this.previousVersion);
        this.isUpdate = !!(this.currentVersion !== this.previousVersion && this.previousVersion);

        await this.setAppVersionInStorage(this.currentVersion);

        const runInfo = {
            currentVersion: this.currentVersion,
            previousVersion: this.previousVersion,
            isFirstRun: this.isFirstRun,
            isUpdate: this.isUpdate,
        };

        onInstalled(runInfo);
    };

    getAppVersionFromStorage = async () => {
        // TODO remove localStorage fallback after some time,
        //  we use it because in the previous version 1.3.13 we used localStorage
        return await storage.get(APP_VERSION_KEY) ?? localStorage.get(APP_VERSION_KEY);
    };

    getAppVersionFromManifest = () => {
        return browser.runtime.getManifest().version;
    };

    setAppVersionInStorage = async (appVersion) => {
        return storage.set(APP_VERSION_KEY, appVersion);
    };
}

export const updateService = new UpdateService();
