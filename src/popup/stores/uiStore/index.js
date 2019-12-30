import { action, observable, computed } from 'mobx';
import { ORIGINAL_CERT_STATUS } from '../consts';

class UiStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable isCertificateModalOpen = false;

    @observable isPageStatusModalOpen = false;

    @observable canOpenPageStatusModalOnFocus = true;

    @observable canOpenCertModalOnFocus = true;

    @observable isPageFilteredByUserFilter = false;

    @observable isLoading = false;

    @observable isProtectionTogglePending = false;

    @observable isExtensionPending = true;

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
                cn: 'modal modal__insecure-page',
                message: 'The site isn\'t using a private connection. Someone might be able to see or change the information you send or get through the site.',
                header: 'Not secure',
            });
        }

        if (isPageSecured || !isFilteringEnabled || isHttpsFilteringEnabled) {
            return ({
                cn: 'modal modal__secure-page',
                message: 'Nothing to block here',
                header: 'Secure page',
            });
        }
        return ({
            cn: 'modal modal__secure-page modal__secure-page--bank',
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

    @action
    setExtensionReloading = (isLoading) => {
        this.isLoading = isLoading;
    };

    @action
    setExtensionPending = (isPending) => {
        this.isExtensionPending = isPending;
    };

    @action
    toggleCertificateModal = () => {
        this.isCertificateModalOpen = !this.isCertificateModalOpen;
    };

    @action
    togglePageStatusModal = () => {
        this.isPageStatusModalOpen = !this.isPageStatusModalOpen;
    };

    @action
    setCanOpenPageStatusModalOnFocus = (canOpenPageStatusModalOnFocus) => {
        this.canOpenPageStatusModalOnFocus = canOpenPageStatusModalOnFocus;
    };

    @action
    setCanOpenCertModalOnFocus = (canOpenCertModalOnFocus) => {
        this.canOpenCertModalOnFocus = canOpenCertModalOnFocus;
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
