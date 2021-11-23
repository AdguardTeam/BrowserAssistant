import { localStorage } from '../localStorage';
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

    isConsentRequired = () => {
        if (this.consentRequired === null) {
            this.consentRequired = this.getFromStorage();
        }
        return !!this.consentRequired;
    }

    setConsentRequired = (value) => {
        this.consentRequired = value;
        this.setToStorage(value);
    }

    getFromStorage = () => {
        let result;
        try {
            result = JSON.parse(localStorage.get(this.CONSENT_REQUIRED_STORAGE_KEY));
        } catch (e) {
            result = false;
        }
        return result;
    };

    setToStorage = (value) => {
        const stringifiedValue = JSON.stringify(value);
        localStorage.set(this.CONSENT_REQUIRED_STORAGE_KEY, stringifiedValue);
    };
}
