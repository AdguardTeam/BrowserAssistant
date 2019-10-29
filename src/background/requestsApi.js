import { RequestTypes, AssistantTypes } from './types';
import { Api } from './Api';

class RequestsApi extends Api {
    VERSIONS = {
        extensionVersion: '1.2.3.5',
        apiVersion: '3',
        userAgent: window.navigator.userAgent,
    }

    init(assistantType = AssistantTypes.nativeAssistant) {
        return this.makeRequest({
            type: RequestTypes.init,
            parameters: {
                version: this.VERSIONS.extensionVersion,
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

    setFilteringStatus({ isEnabled, isHttpsEnabled, url }) {
        return this.makeRequest({
            type: RequestTypes.setFilteringStatus,
            parameters: { isEnabled, isHttpsEnabled, url },
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

    reportSite({ url, referrer }) {
        return this.makeRequest({
            type: RequestTypes.reportSite,
            parameters: { url, referrer, userAgent: this.VERSIONS.userAgent },
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

export default new RequestsApi();
