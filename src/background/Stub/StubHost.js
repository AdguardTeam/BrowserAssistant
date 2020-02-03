import { ORIGINAL_CERT_STATUS } from '../../popup/stores/consts';
import { HostResponseTypes, RequestTypes } from '../../lib/types';
import log from '../../lib/logger';

class StubHost {
    filteringStatus = {
        /** @param isFilteringEnabled boolean * */
        isFilteringEnabled: true,
        /** @param isHttpsFilteringEnabled boolean * */
        isHttpsFilteringEnabled: true,
        /** @param isPageFilteredByUserFilter boolean * */
        isPageFilteredByUserFilter: false,
        /** @param blockedAdsCount number * */
        blockedAdsCount: 0,
        /** @param originalCertIssuer number * */
        totalBlockedCount: 346,
        /** @param originalCertIssuer string * */
        originalCertIssuer: 'GTS CA 1O1',
        /** @param originalCertStatus  {("valid" | "invalid" | "bypassed" | "notfound")}* */
        originalCertStatus: ORIGINAL_CERT_STATUS.VALID,
    };

    getStubResponse = (request) => {
        const { id, type, parameters } = request;
        const response = {
            id: `${id}_resp`,
            requestId: id,
            /** @param lastCheckTime {("ok" | "error")} * */
            result: HostResponseTypes.ok,
            appState: this.appState,
            parameters: null,
            timestamp: new Date().toISOString(),
            data: null,
        };

        switch (type) {
            case RequestTypes.init:
                log.info('INIT');

                this.appState = {
                    /** @param lastCheckTime string * */
                    lastCheckTime: new Date().toISOString(),
                    /** @param isInstalled boolean * */
                    isInstalled: true,
                    /** @param isRunning boolean * */
                    isRunning: true,
                    /** @param isProtectionEnabled boolean* */
                    isProtectionEnabled: true,
                };
                response.parameters = {
                    /** @param version string* */
                    version: '7.3.3050.0',
                    /** @param apiVersion string* */
                    apiVersion: '1',
                    /** @param isValidatedOnHost boolean* */
                    isValidatedOnHost: true,
                };
                break;
            case RequestTypes.getCurrentFilteringState:
                log.info('GET CURRENT FILTERING STATE');

                response.parameters = this.filteringStatus;
                if (parameters.forceStartApp) {
                    this.appState.isRunning = true;
                    this.appState.isProtectionEnabled = true;

                    response.appState = this.appState;
                }
                break;
            case RequestTypes.setProtectionStatus:
                log.info('SET PROTECTION STATUS');

                this.appState.isProtectionEnabled = parameters.isEnabled;
                response.appState = this.appState;
                break;
            case RequestTypes.setFilteringStatus:
                log.info('SET FILTERING STATUS');

                this.filteringStatus.isFilteringEnabled = parameters.isEnabled;
                this.filteringStatus.isFilteringEnabled = parameters.isHttpsEnabled;
                break;
            case RequestTypes.addRule:
                log.info('ADD RULE');
                break;
            case RequestTypes.removeRule:
                log.info('REMOVE RULE');
                break;
            case RequestTypes.removeCustomRules:
                log.info('REMOVE CUSTOM RULES');
                break;
            case RequestTypes.openOriginalCert:
                log.info('OPEN ORIGINAL CERT');
                break;
            case RequestTypes.reportSite:
                log.info('REPORT SITE');
                break;
            case RequestTypes.openFilteringLog:
                log.info('OPEN FILTERING LOG');
                break;
            case RequestTypes.openSettings:
                log.info('OPEN SETTINGS');
                break;
            case RequestTypes.updateApp:
                log.info('UPDATE APP');
                break;
            default:
                break;
        }
        return response;
    };
}

const stubHost = new StubHost();

export default stubHost;
