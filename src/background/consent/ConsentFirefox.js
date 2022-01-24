import { storage } from '../storage';
import ConsentAbstract from './ConsentAbstract';

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
        await this.setToStorage(value);
    }

    getFromStorage = async () => {
        let result;
        try {
            const isConsentRequired = await storage.get(this.CONSENT_REQUIRED_STORAGE_KEY);
            result = JSON.parse(isConsentRequired);
        } catch (e) {
            result = false;
        }
        return result;
    };

    setToStorage = async (value) => {
        const stringifiedValue = JSON.stringify(value);
        await storage.set(this.CONSENT_REQUIRED_STORAGE_KEY, stringifiedValue);
    };
}
