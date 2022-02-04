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
            && compare(previousVersion, STORAGE_MIGRATION_VERSION, '=')) {
            await this.consentSettingMigration();
        }

        // consent agreement migration if updated from v1.2.1 or earlier
        if (browserApi.utils.isFirefoxBrowser
            && compare(previousVersion, STORAGE_MIGRATION_VERSION, '<')) {
            await this.consentAgreementMigration();
        }
    }

    /**
     * Migration consent setting from local storage to browser storage
     */
    consentSettingMigration = async () => {
        const isConsentRequired = JSON.parse(
            localStorage.get(consent.CONSENT_REQUIRED_STORAGE_KEY)
        );
        log.debug(`Consent setting in local storage: ${isConsentRequired}`);

        if (isConsentRequired !== undefined) {
            log.debug('Migrate consent setting from local storage to browser storage');
            await consent.setConsentRequired(isConsentRequired);
        }
    };

    /**
     * Migration from local storage to browser storage
     */
    consentAgreementMigration = async () => {
        // consent agreement storage key (deprecated)
        const AGREEMENT_STORAGE_KEY = 'consent.agreement';

        const isConsentRequired = JSON.parse(localStorage.get(AGREEMENT_STORAGE_KEY));
        log.debug(`Consent agreement setting in local storage: ${isConsentRequired}`);

        await consent.setConsentRequired(!isConsentRequired);
        log.debug(`Set consent setting to browser storage: ${!isConsentRequired}`);
    };
}
