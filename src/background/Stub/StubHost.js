import { ORIGINAL_CERT_STATUS } from '../../popup/stores/consts';
import { HostResponseTypes, RequestTypes } from '../../lib/types';
import log from '../../lib/logger';

class StubHost {
    appState = {
        lastCheckTime: new Date().toISOString(),
        isInstalled: true,
        isRunning: true,
        isProtectionEnabled: true,
    };

    filteringStatus = {
        isFilteringEnabled: true,
        isHttpsFilteringEnabled: true,
        isPageFilteredByUserFilter: false,
        blockedAdsCount: 0,
        totalBlockedCount: 346,
        originalCertIssuer: 'GTS CA 1O1',
        originalCertStatus: ORIGINAL_CERT_STATUS.VALID,
    };

    getStubResponse = (request) => {
        const { id, type, parameters } = request;
        const response = {
            id: `${id}_resp`,
            requestId: id,
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
                    lastCheckTime: new Date().toISOString(),
                    isInstalled: true,
                    isRunning: true,
                    isProtectionEnabled: true,
                };
                response.parameters = {
                    version: '7.3.3050.0',
                    apiVersion: '1',
                    isValidatedOnHost: true,
                };
                break;
            case RequestTypes.getCurrentFilteringState:
                log.info('GET CURRENT FILTERING STATE');
                response.parameters = this.filteringStatus;
                if (parameters.forceStartApp) {
                    this.appState = {
                        ...this.appState,
                        isRunning: true,
                        isProtectionEnabled: true,
                    };
                    response.appState = this.appState;
                }
                break;
            case RequestTypes.setProtectionStatus:
                log.info('SET PROTECTION STATUS');
                this.appState = {
                    ...this.appState,
                    isRunning: parameters.isEnabled,
                };
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
