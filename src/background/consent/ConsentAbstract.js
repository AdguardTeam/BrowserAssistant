// !IMPORTANT!
// export './ConsentAbstract' is replaced during webpack compilation
// with NormalModuleReplacementPlugin to proper browser implementation
// from './ConsentChrome' or './ConsentFirefox'
/**
 * Abstract consent class
 */
export default class ConsentAbstract {
    /**
     * Returns true if consent is required
     * @returns {Promise<boolean>}
     */
    async isConsentRequired() {
        throw new Error('Not implemented');
    }

    /**
     * Sets consent value
     * @param {boolean} value
     * @returns {void}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setConsentRequired(value) {
        throw new Error('Not implemented');
    }
}
