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
     * @param {object} parameters
     * @param {string} parameters.url
     * @param {number} parameters.port
     * @param {boolean} parameters.forceStartApp
     * @returns {Promise<object>}
     */
    getCurrentFilteringState = ({ url, port, forceStartApp = false }) => api.makeRequest({
        type: REQUEST_TYPES.getCurrentFilteringState,
        parameters: { url, port, forceStartApp },
    });

    /**
     * @param {object} parameters
     * @param {boolean} parameters.isEnabled
     * @returns {Promise<object>}
     */
    setProtectionStatus = ({ isEnabled }) => api.makeRequest({
        type: REQUEST_TYPES.setProtectionStatus,
        parameters: { isEnabled },
    });

    /**
     * @param {object} parameters
     * @param {boolean} parameters.isEnabled
     * @param {boolean} parameters.isHttpsEnabled
     * @param {string} parameters.url
     * @returns {Promise<object>}
     */
    setFilteringStatus = ({ isEnabled, isHttpsEnabled, url }) => api.makeRequest({
        type: REQUEST_TYPES.setFilteringStatus,
        parameters: { isEnabled, isHttpsEnabled, url },
    });

    /**
     * @param {object} parameters
     * @param {string} parameters.ruleText
     * @returns {Promise<object>}
     */
    addRule = ({ ruleText }) => api.makeRequest({
        type: REQUEST_TYPES.addRule,
        parameters: { ruleText },
    });

    /**
     * @param {object} parameters
     * @param {string} parameters.ruleText
     * @returns {Promise<object>}
     */
    removeRule = ({ ruleText }) => api.makeRequest({
        type: REQUEST_TYPES.removeRule,
        parameters: { ruleText },
    });

    /**
     * @param {object} parameters
     * @param {string} parameters.url
     * @returns {Promise<object>}
     */
    removeCustomRules = ({ url }) => api.makeRequest({
        type: REQUEST_TYPES.removeCustomRules,
        parameters: { url },
    });

    /**
     * @param {object} parameters
     * @param {string} parameters.domain
     * @param {number} parameters.port
     * @returns {Promise<object>}
     */
    openOriginalCert = ({ domain, port }) => api.makeRequest({
        type: REQUEST_TYPES.openOriginalCert,
        parameters: { domain, port },
    });

    /**
     * @param {object} parameters
     * @param {string} parameters.url
     * @param {string} parameters.referrer
     * @returns {Promise<object>}
     */
    reportSite = ({ url, referrer }) => api.makeRequest({
        type: REQUEST_TYPES.reportSite,
        parameters: {
            url,
            referrer,
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
