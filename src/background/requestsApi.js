import { RequestTypes, AssistantTypes } from '../lib/types';
import { Api } from './Api';

const config = require('../../package.json');

class RequestsApi extends Api {
    VERSIONS = {
        apiVersion: '3',
        userAgent: window.navigator.userAgent,
    }

    init(assistantType = AssistantTypes.nativeAssistant) {
        return this.makeRequest({
            type: RequestTypes.init,
            parameters: {
                version: config.version,
                apiVersion: this.VERSIONS.apiVersion,
                userAgent: this.VERSIONS.userAgent,
                type: assistantType,
            },
        });
    }

    getCurrentAppState() {
        return this.makeRequest({
            type: RequestTypes.getCurrentAppState,
        });
    }

    getCurrentFilteringState(url) {
        return this.makeRequest({
            type: RequestTypes.getCurrentFilteringState,
            parameters: {
                url,
            },
        });
    }

    setProtectionStatus(isEnabled) {
        return this.makeRequest({
            type: RequestTypes.setProtectionStatus,
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
        return this.makeRequest({
            type: RequestTypes.setFilteringStatus,
            parameters,
        });
    }

    addRule(hostname) {
        return this.makeRequest({
            type: RequestTypes.addRule,
            parameters: { ruleText: `||${hostname}^` },
        });
    }

    removeRule(hostname) {
        return this.makeRequest({
            type: RequestTypes.removeRule,
            parameters: { ruleText: `||${hostname}^` },
        });
    }

    removeCustomRules(url) {
        return this.makeRequest({
            type: RequestTypes.removeCustomRules,
            parameters: { url },
        });
    }


    openOriginCert(domain) {
        return this.makeRequest({
            type: RequestTypes.openOriginCert,
            parameters: { domain },
        });
    }

    /**
     * @param {object} params
     * @param {string} params.url
     * @param {string} params.referrer
     * @returns {function}
     */
    reportSite(params) {
        return this.makeRequest({
            type: RequestTypes.reportSite,
            parameters: { ...params, userAgent: this.VERSIONS.userAgent },
        });
    }

    openFilteringLog() {
        return this.makeRequest({
            type: RequestTypes.openFilteringLog,
        });
    }

    openSettings() {
        return this.makeRequest({
            type: RequestTypes.openSettings,
        });
    }
}

const requests = new RequestsApi();

export default requests;
