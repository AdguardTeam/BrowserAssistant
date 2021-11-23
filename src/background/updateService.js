import browser from 'webextension-polyfill';

import { localStorage } from './localStorage';
import log from '../lib/logger';

/**
 * Service with data about current app state
 */
class UpdateService {
    APP_VERSION_KEY = 'update.service.app.version';

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
    }

    getVersionInfoFromStorage = () => {
        const previousVersion = this.getAppVersionFromStorage();
        const currentVersion = this.getAppVersionFromManifest();
        return {
            currentVersion,
            previousVersion,
        };
    }

    init = async (onInstalled) => {
        let versions = await this.getVersionsFromInstalledEvent();
        if (!versions) {
            versions = this.getVersionInfoFromStorage();
            log.debug('Versions retrieved from storage', versions);
        } else {
            log.debug('Versions retrieved from installed event', versions);
        }

        this.currentVersion = versions.currentVersion;
        this.previousVersion = versions.previousVersion;

        this.isFirstRun = (this.currentVersion !== this.previousVersion && !this.previousVersion);
        this.isUpdate = !!(this.currentVersion !== this.previousVersion && this.previousVersion);

        this.setAppVersionInStorage(this.currentVersion);

        const runInfo = {
            currentVersion: this.currentVersion,
            previousVersion: this.previousVersion,
            isFirstRun: this.isFirstRun,
            isUpdate: this.isUpdate,
        };

        onInstalled(runInfo);
    }

    getAppVersionFromStorage = () => {
        return localStorage.get(this.APP_VERSION_KEY);
    };

    getAppVersionFromManifest = () => {
        return browser.runtime.getManifest().version;
    };

    setAppVersionInStorage = (appVersion) => {
        return localStorage.set(this.APP_VERSION_KEY, appVersion);
    };
}

export const updateService = new UpdateService();
