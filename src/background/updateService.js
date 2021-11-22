import browser from 'webextension-polyfill';

import { localStorage } from './localStorage';

/**
 * Service with data about current app state
 */
class UpdateService {
    APP_VERSION_KEY = 'update.service.app.version';

    init = () => {
        this.prevVersion = this.getAppVersionFromStorage();
        this.currentVersion = this.getAppVersionFromManifest();

        this.isFirstRun = (this.currentVersion !== this.prevVersion && !this.prevVersion);
        this.isUpdate = !!(this.currentVersion !== this.prevVersion && this.prevVersion);

        this.setAppVersionInStorage(this.currentVersion);
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
