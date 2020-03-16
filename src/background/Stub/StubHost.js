/**
 * Stub for the native application API.
 * It is used for debugging purposes only.
 */

import nanoid from 'nanoid';
import { ORIGINAL_CERT_STATUS } from '../../popup/stores/consts';
import {
    HOST_REQUEST_TYPES, HOST_RESPONSE_TYPES, REQUEST_TYPES, RESPONSE_TYPE_PREFIXES,
} from '../../lib/types';
import log from '../../lib/logger';
import browserApi from '../../lib/browserApi';
import versions from '../versions';
import innerMessaging from '../../lib/innerMessaging';

const { BASE_LOCALE } = require('../../../tasks/consts');

// TODO: update testing logic
class StubHost {
    delay = 500;

    REPORT_URL = 'https://reports.adguard.com/ru/new_issue.html';

    filteringStatus = {
        /** @param isFilteringEnabled boolean * */
        isFilteringEnabled: true,
        /** @param isHttpsFilteringEnabled boolean * */
        isHttpsFilteringEnabled: true,
        /** @param isPageFilteredByUserFilter boolean * */
        isPageFilteredByUserFilter: false,
        /** @param blockedAdsCount number * */
        blockedAdsCount: 0,
        /** @param totalBlockedCount number * */
        totalBlockedCount: 346,
        /** @param originalCertIssuer string * */
        originalCertIssuer: 'GTS CA 1O1',
        /** @param originalCertStatus  {("valid" | "invalid" | "bypassed" | "notfound")}* */
        originalCertStatus: ORIGINAL_CERT_STATUS.VALID,
    };

    appState = {
        /** @param lastCheckTime string * */
        lastCheckTime: new Date().toISOString(),
        /** @param isInstalled boolean * */
        isInstalled: true,
        /** @param isRunning boolean * */
        isRunning: true,
        /** @param isProtectionEnabled boolean* */
        isProtectionEnabled: true,
        /** @param locale string* */
        locale: BASE_LOCALE,
    };

    set isFilteringEnabled(isFilteringEnabled) {
        this.filteringStatus.isFilteringEnabled = isFilteringEnabled;
        this.#makeRequest();
    }

    set isHttpsFilteringEnabled(isHttpsFilteringEnabled) {
        this.filteringStatus.isHttpsFilteringEnabled = isHttpsFilteringEnabled;
        this.#makeRequest();
    }

    set isPageFilteredByUserFilter(isPageFilteredByUserFilter) {
        this.filteringStatus.isPageFilteredByUserFilter = isPageFilteredByUserFilter;
        this.#makeRequest();
    }

    set blockedAdsCount(blockedAdsCount) {
        this.filteringStatus.blockedAdsCount = blockedAdsCount;
        this.#makeRequest();
    }

    set totalBlockedCount(totalBlockedCount) {
        this.filteringStatus.totalBlockedCount = totalBlockedCount;
        this.#makeRequest();
    }

    set originalCertIssuer(originalCertIssuer) {
        this.filteringStatus.originalCertIssuer = originalCertIssuer;
        this.#makeRequest();
    }

    set originalCertStatus(originalCertStatus) {
        this.filteringStatus.originalCertStatus = originalCertStatus;
        this.#makeRequest();
    }

    set lastCheckTime(lastCheckTime) {
        this.appState.lastCheckTime = lastCheckTime;
        this.#makeRequest();
    }

    set isInstalled(isInstalled) {
        this.appState.isInstalled = isInstalled;
        this.#makeRequest();
    }

    set isRunning(isRunning) {
        this.appState.isRunning = isRunning;
        this.appState.locale = isRunning ? this.appState.locale : '';
        this.#makeRequest();
    }

    set isProtectionEnabled(isProtectionEnabled) {
        this.appState.isProtectionEnabled = isProtectionEnabled;
        this.#makeRequest();
    }

    set locale(locale) {
        this.appState.locale = locale;
        this.#makeRequest();
    }

    get isFilteringEnabled() {
        return this.filteringStatus.isFilteringEnabled;
    }

    get isHttpsFilteringEnabled() {
        return this.filteringStatus.appState.isHttpsFilteringEnabled;
    }

    get isPageFilteredByUserFilter() {
        return this.filteringStatus.isPageFilteredByUserFilter;
    }

    get blockedAdsCount() {
        return this.filteringStatus.blockedAdsCount;
    }

    get totalBlockedCount() {
        return this.filteringStatus.totalBlockedCount;
    }

    get originalCertIssuer() {
        return this.filteringStatus.originalCertIssuer;
    }

    get originalCertStatus() {
        return this.filteringStatus.originalCertStatus;
    }

    get lastCheckTime() {
        return this.appState.lastCheckTime;
    }

    get isInstalled() {
        return this.appState.isInstalled;
    }

    get isRunning() {
        return this.appState.isRunning;
    }

    get isProtectionEnabled() {
        return this.appState.isProtectionEnabled;
    }

    get locale() {
        return this.appState.locale;
    }

    #makeRequest = async (delay) => {
        const request = {
            id: `ADG_APP_STATE_RESPONSE_MESSAGE_${nanoid()}`,
            type: HOST_REQUEST_TYPES.hostRequest,
            parameters: this.filteringStatus,
        };
        const response = await this.getStubResponse(request, delay);
        return this.#initHandler(response);
    };

    #initHandler = (response) => {
        log.info(`response ${response.id}`, response);
        const { parameters } = response;

        // Ignore requests without identifying prefix ADG
        if (!response.requestId.startsWith(RESPONSE_TYPE_PREFIXES.ADG)) {
            return;
        }

        if (parameters && response.requestId.startsWith(RESPONSE_TYPE_PREFIXES.ADG_INIT)) {
            this.isAppUpToDate = (versions.apiVersion <= parameters.apiVersion);
            innerMessaging.isAppUpToDate = this.isAppUpToDate;

            this.isExtensionUpdated = parameters.isValidatedOnHost;
            innerMessaging.isExtensionUpdated = this.isExtensionUpdated;
        }

        browserApi.runtime.sendMessage({ result: response.result, response });
    };

    /**
     * @param delay
     * @returns {Promise<void>}
     */
    #waitDelay = async (delay = this.delay) => {
        return new Promise((resolve) => (setTimeout(resolve, delay)));
    };

    /**
     * Emulates server response with delay
     * @param request object
     * @param delay [number]
     * @returns {Promise<object>}
     */
    getStubResponse = async (request, delay) => {
        const { id, type, parameters } = request;
        const response = {
            id: `${id}_resp`,
            requestId: id,
            /** @param lastCheckTime {("OK" | "ERROR")} * */
            result: HOST_RESPONSE_TYPES.OK,
            appState: this.appState,
            timestamp: new Date().toISOString(),
            data: null,
        };

        if (parameters) {
            response.parameters = parameters;
        }

        await this.#waitDelay(delay);

        switch (type) {
            case REQUEST_TYPES.init:
                log.info('INIT');

                response.parameters = {
                    /** @param version string* */
                    version: '7.3.3050.0',
                    /** @param apiVersion string* */
                    apiVersion: '1',
                    /** @param isValidatedOnHost boolean* */
                    isValidatedOnHost: true,
                };
                break;

            case REQUEST_TYPES.getCurrentAppState:
                log.info('GET CURRENT APP STATE');
                break;
            case REQUEST_TYPES.getCurrentFilteringState:
                log.info('GET CURRENT FILTERING STATE');

                response.parameters = this.filteringStatus;
                if (parameters.forceStartApp) {
                    this.appState.isRunning = true;
                    this.appState.isProtectionEnabled = true;

                    response.appState = this.appState;
                }
                break;
            case REQUEST_TYPES.setProtectionStatus:
                log.info('SET PROTECTION STATUS');

                this.appState.isProtectionEnabled = parameters.isEnabled;
                response.appState = this.appState;
                break;
            case REQUEST_TYPES.setFilteringStatus:
                log.info('SET FILTERING STATUS');

                this.filteringStatus.isFilteringEnabled = parameters.isEnabled;
                this.filteringStatus.isHttpsFilteringEnabled = parameters.isHttpsEnabled;
                break;
            case REQUEST_TYPES.addRule:
                log.info('ADD RULE');
                break;
            case REQUEST_TYPES.removeRule:
                log.info('REMOVE RULE');
                break;
            case REQUEST_TYPES.removeCustomRules:
                log.info('REMOVE CUSTOM RULES');

                this.filteringStatus.isFilteringEnabled = true;
                this.filteringStatus.isHttpsFilteringEnabled = true;
                this.filteringStatus.isPageFilteredByUserFilter = false;
                break;
            case REQUEST_TYPES.openOriginalCert:
                log.info('OPEN ORIGINAL CERT');
                break;
            case REQUEST_TYPES.reportSite:
                // Don't modify the object to log the correct state
                response.parameters = {
                    ...response.parameters,
                    reportUrl: this.REPORT_URL,
                };
                log.info('REPORT SITE');
                break;
            case REQUEST_TYPES.openFilteringLog:
                log.info('OPEN FILTERING LOG');
                break;
            case REQUEST_TYPES.openSettings:
                log.info('OPEN SETTINGS');
                break;
            case REQUEST_TYPES.updateApp:
                log.info('UPDATE APP');
                break;
            case HOST_REQUEST_TYPES.hostRequest:
                log.info('HOST REQUEST');
                break;
            default:
                break;
        }
        return response;
    };
}

const stubHost = new StubHost();
window.stubHost = stubHost;

export default stubHost;
