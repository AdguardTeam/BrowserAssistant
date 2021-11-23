import ConsentAbstract from './ConsentAbstract';

/**
 * Manages user consent with policies
 */
export default class ConsentChrome extends ConsentAbstract {
    /**
     * Always returns false for chrome
     * @returns {boolean}
     */
    isConsentRequired() {
        return false;
    }

    /**
     * Sets consent value
     * @param {boolean} value
     * @returns {void}
     */
    // eslint-disable-next-line no-unused-vars
    setConsentRequired(value) {
    }
}
