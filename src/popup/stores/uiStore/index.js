import {
    action, observable, computed,
} from 'mobx';
import { ORIGINAL_CERT_STATUS, SECURE_PAGE_MODAL_IDS } from '../consts';
import { defineNewState } from '../../helpers';

class UiStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable isPageFilteredByUserFilter = false;

    @observable isLoading = false;

    @observable isProtectionTogglePending = false;

    @observable isExtensionPending = true;

    @observable certStatusModalState = {
        isHovered: false,
        isFocused: false,
        isEntered: false,
        isClicked: false,
    };

    @observable secureStatusModalState = {
        isHovered: false,
        isFocused: false,
        isEntered: false,
        isClicked: false,
    };

    @computed get isCertStatusModalOpen() {
        return (Object.values(this.certStatusModalState).some(state => state === true));
    }

    @computed get isPageStatusModalOpen() {
        return (Object.values(this.secureStatusModalState).some(state => state === true));
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

    @computed get securePageModalState() {
        const {
            isPageSecured, isHttps, isFilteringEnabled, isHttpsFilteringEnabled,
        } = this.rootStore.settingsStore;

        if (!isHttps && !isPageSecured) {
            return ({
                id: SECURE_PAGE_MODAL_IDS.NOT_SECURE,
                message: 'The site isn\'t using a private connection. Someone might be able to see or change the information you send or get through the site.',
                header: 'Not secure',
            });
        }

        if (isPageSecured || !isFilteringEnabled || isHttpsFilteringEnabled) {
            return ({
                id: SECURE_PAGE_MODAL_IDS.SECURE,
                message: 'Nothing to block here',
                header: 'Secure page',
            });
        }
        return ({
            id: SECURE_PAGE_MODAL_IDS.BANK,
            message: `By default, we don't filter HTTPS traffic for the payment system and bank websites.
            You can enable the filtering yourself: tap on the yellow 'lock' on the left.`,
            header: 'Secure page',
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

    @action updateCertStatusModalState = (eventType, payload) => {
        let defaultState;
        if (!payload) {
            defaultState = defineNewState(eventType);
        }
        const newState = payload || defaultState;
        this.certStatusModalState = {
            ...this.certStatusModalState,
            ...newState,
        };
    };

    @action updateSecureStatusModalState = (eventType, payload) => {
        let defaultState;
        if (!payload) {
            defaultState = defineNewState(eventType);
        }
        const newState = payload || defaultState;
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
    setPageFilteredByUserFilter = (isPageFilteredByUserFilter) => {
        this.isPageFilteredByUserFilter = isPageFilteredByUserFilter;
    };

    @action
    setProtectionTogglePending = (isProtectionTogglePending) => {
        this.isProtectionTogglePending = isProtectionTogglePending;
    };
}

export default UiStore;
