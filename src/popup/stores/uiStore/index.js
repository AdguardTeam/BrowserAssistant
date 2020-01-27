import {
    action, observable, computed,
} from 'mobx';
import {
    defaultModalState, eventTypeToModalStateMap, ORIGINAL_CERT_STATUS, SECURE_STATUS_MODAL_IDS,
} from '../consts';
import { checkSomeIsTrue } from '../../helpers';

class UiStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable isPageFilteredByUserFilter = false;

    @observable isLoading = false;

    @observable isProtectionTogglePending = false;

    @observable isExtensionPending = true;

    @observable certStatusModalState = { ...defaultModalState };

    @observable secureStatusModalState = { ...defaultModalState };

    @computed get isCertStatusModalOpen() {
        return checkSomeIsTrue(this.certStatusModalState);
    }

    @computed get isPageStatusModalOpen() {
        return checkSomeIsTrue(this.secureStatusModalState);
    }

    @computed get globalTabIndex() {
        return (this.isLoading ? -1 : 0);
    }

    @computed get requestStatus() {
        return ({
            isSuccess: this.isAppWorking === true,
            isError: this.isAppWorking === false,
            isPending: this.isExtensionPending === true,
        });
    }

    @computed get secureStatusModalInfo() {
        const {
            isPageSecured, isHttps, isFilteringEnabled, isHttpsFilteringEnabled,
        } = this.rootStore.settingsStore;

        if (!isHttps && !isPageSecured) {
            return ({
                id: SECURE_STATUS_MODAL_IDS.NOT_SECURE,
                message: 'site_not_using_private_protection',
                header: 'not_secure',
            });
        }

        if (isPageSecured || !isFilteringEnabled || isHttpsFilteringEnabled) {
            return ({
                id: SECURE_STATUS_MODAL_IDS.SECURE,
                message: 'nothing_to_block_here',
                header: 'secure_page',
            });
        }
        // TODO: get information about bank page (from host)
        return ({
            id: SECURE_STATUS_MODAL_IDS.BANK,
            message: 'not_filtering_https',
            header: 'secure_page',
        });
    }

    @computed get certStatus() {
        const { originalCertStatus } = this.rootStore.settingsStore;
        return ({
            isValid: originalCertStatus === ORIGINAL_CERT_STATUS.VALID,
            isInvalid: originalCertStatus === ORIGINAL_CERT_STATUS.INVALID,
            isBypassed: originalCertStatus === ORIGINAL_CERT_STATUS.BYPASSED,
            isNotFound: originalCertStatus === ORIGINAL_CERT_STATUS.NOTFOUND,
        });
    }

    @computed get isAppWorking() {
        const {
            isAppUpToDate,
            isExtensionUpdated,
            isSetupCorrectly,
            isInstalled,
            isRunning,
            isProtectionEnabled,
        } = this.rootStore.settingsStore;

        return [isInstalled,
            isRunning,
            isProtectionEnabled,
            isAppUpToDate,
            isExtensionUpdated,
            isSetupCorrectly].every(state => state === true);
    }

    @action
    updateCertStatusModalState = (eventType, newState = eventTypeToModalStateMap[eventType]) => {
        this.certStatusModalState = {
            ...this.certStatusModalState,
            ...newState,
        };
    };

    @action
    resetCertStatusModalState = () => {
        this.certStatusModalState = defaultModalState;
    };

    @action
    updateSecureStatusModalState = (eventType, newState = eventTypeToModalStateMap[eventType]) => {
        this.secureStatusModalState = {
            ...this.secureStatusModalState,
            ...newState,
        };
    };

    @action
    setExtensionReloading = (isLoading) => {
        this.isLoading = isLoading;
    };

    @action
    setExtensionPending = (isPending) => {
        this.isExtensionPending = isPending;
    };

    @action
    setExtensionReloadingAndPending = (isLoading = false, isPending = false) => {
        this.setExtensionReloading(isLoading);
        this.setExtensionPending(isPending);
    };

    @action
    setPageFilteredByUserFilter = (isPageFilteredByUserFilter) => {
        this.isPageFilteredByUserFilter = isPageFilteredByUserFilter;
    };

    @action
    setProtectionTogglePending = (isProtectionTogglePending) => {
        this.isProtectionTogglePending = isProtectionTogglePending;
    };
}

export default UiStore;
