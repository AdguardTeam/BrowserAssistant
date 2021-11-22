import { localStorage } from '../localStorage';
import ConsentAbstract from './ConsentAbstract';

/**
 * Manages user consent with policies
 */
export default class ConsentFirefox extends ConsentAbstract {
    /**
     * Key used to store agreement value in the storage
     * @type {string}
     */
    AGREEMENT_STORAGE_KEY = 'consent.agreement';

    /**
     * Agreement property
     * @type {boolean}
     */
    agreement = false;

    /**
     * Returns information about consent state
     * @returns {boolean}
     */
    agreementReceived() {
        return !!this.agreement;
    }

    /**
     * Sets consent agreement
     * @returns {void}
     */
    setAgreementReceived() {
        this.agreement = true;
        localStorage.set(this.AGREEMENT_STORAGE_KEY, this.agreement);
    }

    /**
     * Retrieves consent agreement data from storage
     * @returns {void}
     */
    init() {
        const storedAgreement = localStorage.get(this.AGREEMENT_STORAGE_KEY);
        this.agreement = !!storedAgreement;
    }
}
