import ConsentAbstract from './ConsentAbstract';

/**
 * Manages user consent with policies
 */
export default class ConsentChrome extends ConsentAbstract {
    /**
     * Always returns true for chrome
     * @returns {boolean}
     */
    agreementReceived() {
        return true;
    }

    /**
     * Does nothing
     * @returns {void}
     */
    setAgreementReceived() {

    }

    /**
     * Does nothing
     * @returns {void}
     */
    init() {

    }
}
