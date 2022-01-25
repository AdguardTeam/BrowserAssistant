import { storage } from '../storage';
import { localStorage } from '../localStorage';
import ConsentAbstract from './ConsentAbstract';
import log from '../../lib/logger';

/**
 * Manages user consent with policies
 */
export default class ConsentFirefox extends ConsentAbstract {
    /**
     * Key used to store consent flag in the storage
     * @type {string}
     */
    CONSENT_REQUIRED_STORAGE_KEY = 'consent.required';

    /**
     * Flag with consent required state
     */
    consentRequired = null;

    isConsentRequired = async () => {
        if (this.consentRequired === null) {
            this.consentRequired = await this.getFromStorage();
        }
        return !!this.consentRequired;
    }

    setConsentRequired = async (value) => {
        this.consentRequired = value;
        await storage.set(this.CONSENT_REQUIRED_STORAGE_KEY, value);
    }

    getFromStorage = async () => {
        let result;
        try {
            result = await storage.get(this.CONSENT_REQUIRED_STORAGE_KEY);
        } catch (e) {
            result = false;
        }
        return result;
    };

    /**
     * Migration from local storage to browser storage
     */
    storageMigration = async () => {
        const isConsentRequired = JSON.parse(localStorage.get(this.CONSENT_REQUIRED_STORAGE_KEY));
        if (isConsentRequired !== undefined) {
            log.debug('Migrate consent setting from local storage to browser storage');
            await this.setConsentRequired(isConsentRequired);
        }
    };
}
