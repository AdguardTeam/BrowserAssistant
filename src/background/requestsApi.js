import { REQUEST_TYPES } from '../lib/types';
import api from './Api';
import versions from './versions';

class RequestsApi {
    /**
     * @returns {Promise<object>}
     */
    getCurrentAppState = () => api.makeRequest({
        type: REQUEST_TYPES.getCurrentAppState,
    });

    /**
     * @param {string} parameters.url
     * @param {number} parameters.port
     * @param {boolean} parameters.forceStartApp
     * @returns {Promise<object>}
     */
    getCurrentFilteringState = ({ url, port, forceStartApp = false }) => api.makeRequest({
        type: REQUEST_TYPES.getCurrentFilteringState,
        parameters: {
            url,
            port,
            forceStartApp,
        },
    });

    /**
     * @param {boolean} parameters.isEnabled
     * @returns {Promise<object>}
     */
    setProtectionStatus = (parameters) => api.makeRequest({
        type: REQUEST_TYPES.setProtectionStatus,
        parameters,
    });

    /**
     * @param {object} parameters
     * @param {boolean} parameters.isEnabled
     * @param {boolean} parameters.isHttpsEnabled
     * @param {string} parameters.url
     * @returns {function}
     */
    setFilteringStatus = (parameters) => api.makeRequest({
        type: REQUEST_TYPES.setFilteringStatus,
        parameters,
    });

    /**
     * @param {string} parameters.ruleText
     * @returns {Promise<object>}
     */
    addRule = (parameters) => api.makeRequest({
        type: REQUEST_TYPES.addRule,
        parameters,
    });

    /**
     * @param {string} parameters.ruleText
     * @returns {Promise<object>}
     */
    removeRule = (parameters) => api.makeRequest({
        type: REQUEST_TYPES.removeRule,
        parameters,
    });

    /**
     * @param {string} parameters.url
     * @returns {Promise<object>}
     */
    removeCustomRules = (parameters) => api.makeRequest({
        type: REQUEST_TYPES.removeCustomRules,
        parameters,
    });

    /**
     * @param {string} parameters.domain
     * @param {number} parameters.port
     * @returns {Promise<object>}
     */
    openOriginalCert = (parameters) => api.makeRequest({
        type: REQUEST_TYPES.openOriginalCert,
        parameters,
    });

    /**
     * @param {object} parameters
     * @param {string} parameters.url
     * @param {string} parameters.referrer
     * @returns {function}
     */
    reportSite = (parameters) => api.makeRequest({
        type: REQUEST_TYPES.reportSite,
        parameters: {
            ...parameters,
            userAgent: versions.userAgent,
        },
    });

    /**
     * @returns {Promise<object>}
     */
    openFilteringLog = () => api.makeRequest({
        type: REQUEST_TYPES.openFilteringLog,
    });

    /**
     * @returns {Promise<object>}
     */
    openSettings = () => api.makeRequest({
        type: REQUEST_TYPES.openSettings,
    });

    /**
     * @returns {Promise<object>}
     */
    updateApp = () => api.makeRequest({
        type: REQUEST_TYPES.updateApp,
    });
}

const requests = new RequestsApi();

export default requests;
