import { REQUEST_TYPES } from '../lib/types';
import api from './Api';
import versions from './versions';

class RequestsApi {
    getCurrentAppState() {
        return api.makeRequest({
            type: REQUEST_TYPES.getCurrentAppState,
        });
    }

    getCurrentFilteringState(url, port, forceStartApp = false) {
        return api.makeRequest({
            type: REQUEST_TYPES.getCurrentFilteringState,
            parameters: {
                url,
                port,
                forceStartApp,
            },
        });
    }

    setProtectionStatus(isEnabled) {
        return api.makeRequest({
            type: REQUEST_TYPES.setProtectionStatus,
            parameters: {
                isEnabled,
            },
        });
    }

    /**
     * @param {object} parameters
     * @param {boolean} parameters.isEnabled
     * @param {boolean} parameters.isHttpsEnabled
     * @param {string} parameters.url
     * @returns {function}
     */
    setFilteringStatus(parameters) {
        return api.makeRequest({
            type: REQUEST_TYPES.setFilteringStatus,
            parameters,
        });
    }

    addRule(ruleText) {
        return api.makeRequest({
            type: REQUEST_TYPES.addRule,
            parameters: { ruleText },
        });
    }

    removeRule(ruleText) {
        return api.makeRequest({
            type: REQUEST_TYPES.removeRule,
            parameters: { ruleText },
        });
    }

    removeCustomRules(url) {
        return api.makeRequest({
            type: REQUEST_TYPES.removeCustomRules,
            parameters: { url },
        });
    }


    openOriginalCert(domain, port) {
        return api.makeRequest({
            type: REQUEST_TYPES.openOriginalCert,
            parameters: { domain, port },
        });
    }

    /**
     * @param {object} params
     * @param {string} params.url
     * @param {string} params.referrer
     * @returns {function}
     */
    reportSite(params) {
        return api.makeRequest({
            type: REQUEST_TYPES.reportSite,
            parameters: { ...params, userAgent: versions.userAgent },
        });
    }

    openFilteringLog() {
        return api.makeRequest({
            type: REQUEST_TYPES.openFilteringLog,
        });
    }

    openSettings() {
        return api.makeRequest({
            type: REQUEST_TYPES.openSettings,
        });
    }

    updateApp() {
        return api.makeRequest({
            type: REQUEST_TYPES.updateApp,
        });
    }
}

const requests = new RequestsApi();

export default requests;
