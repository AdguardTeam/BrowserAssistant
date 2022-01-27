import { compare } from 'compare-versions';

import { localStorage } from '../localStorage';
import log from '../../lib/logger';
import { consent } from '../consent';
import browserApi from '../../lib/browserApi';

const STORAGE_MIGRATION_VERSION = '1.2.2';

export class MigrationService {
    async migrate(previousVersion) {
        // consent setting moved from local storage to
        // browser storage after version 1.2.2 in firefox only
        if (browserApi.utils.isFirefoxBrowser
            && compare(previousVersion, STORAGE_MIGRATION_VERSION, '<=')) {
            await this.storageMigrationForFirefox();
        }
    }

    /**
     * Migration from local storage to browser storage
     */
    storageMigrationForFirefox = async () => {
        const isConsentRequired = JSON.parse(
            localStorage.get(consent.CONSENT_REQUIRED_STORAGE_KEY)
        );
        if (isConsentRequired !== undefined) {
            log.debug('Migrate consent setting from local storage to browser storage');
            await consent.setConsentRequired(isConsentRequired);
        }
    };
}

