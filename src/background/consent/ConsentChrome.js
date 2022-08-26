import ConsentAbstract from './ConsentAbstract';

/**
 * Manages user consent with policies
 */
export default class ConsentChrome extends ConsentAbstract {
    /**
     * Always returns false for chrome
     * @returns {boolean}
     */
    async isConsentRequired() {
        return false;
    }

    /**
     * Sets consent value
     * @param {boolean} value
     * @returns {void}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setConsentRequired(value) {
    }
}
