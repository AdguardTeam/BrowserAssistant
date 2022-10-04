import { compare } from 'compare-versions';

import { localStorage } from '../localStorage';
import { storage } from '../storage';
import log from '../../lib/logger';
import { consent } from '../consent';
import { browserApi } from '../../lib/browserApi';
import { APP_VERSION_KEY } from '../../lib/types';

const FIREFOX_CONSENT_MIGRATION_VERSION = '1.2.2';
const STORAGE_DATA_MIGRATION_VERSION = '1.3.15';

export class MigrationService {
    async migrate(previousVersion) {
        // consent setting moved from local storage to
        // browser storage after version 1.2.2 in firefox only
        if (browserApi.utils.isFirefoxBrowser
            && compare(previousVersion, FIREFOX_CONSENT_MIGRATION_VERSION, '<=')) {
            await this.storageMigrationForFirefox();
        }

        if (compare(previousVersion, STORAGE_DATA_MIGRATION_VERSION, '<=')) {
            await this.localStorageDataMigration();
        }
    }

    /**
     * Migration from local storage to browser storage
     */
    storageMigrationForFirefox = async () => {
        const isConsentRequired = JSON.parse(
            localStorage.get(consent.CONSENT_REQUIRED_STORAGE_KEY),
        );
        if (isConsentRequired !== undefined) {
            log.debug('Migrate consent setting from local storage to browser storage');
            await consent.setConsentRequired(isConsentRequired);
        }
    };

    /**
     * Migrates data from local storage to browser storage.
     * There is only app version data to migrate.
     */
    localStorageDataMigration = async () => {
        const appVersion = localStorage.get(APP_VERSION_KEY);
        await storage.set(APP_VERSION_KEY, appVersion);
        log.debug('App version data migrated from local storage to browser storage');
    };
}
