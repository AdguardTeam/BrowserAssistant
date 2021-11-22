// !IMPORTANT!
// export './ConsentAbstract' is replaced during webpack compilation
// with NormalModuleReplacementPlugin to proper browser implementation
// from './ConsentChrome' or './ConsentFirefox'
/**
 * Abstract consent class
 */
export default class ConsentAbstract {
    /**
     * Returns information about consent state
     * @returns {boolean}
     */
    agreementReceived() {
        throw new Error('Not implemented');
    }

    /**
     * Sets consent agreement
     * @returns {void}
     */
    setAgreementReceived() {
        throw new Error('Not implemented');
    }

    /**
     * Retrieves consent agreement data from storage
     * @returns {void}
     */
    init() {
        throw new Error('Not implemented');
    }
}
