import { action, observable, computed } from 'mobx';
import { REQUEST_STATUSES } from '../consts';

class UiStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable isOpenCertificateModal = false;

    @observable isInfoHovered = false;

    @observable isPageFilteredByUserFilter = false;

    @observable isAppWorking = true;

    @observable requestStatus = REQUEST_STATUSES.PENDING;

    @observable isReloading = false;

    @action
    setRequestStatus = () => {
        this.requestStatus = this.isAppWorking ? REQUEST_STATUSES.SUCCESS : REQUEST_STATUSES.ERROR;
    };

    @computed get securityModalState() {
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

    @computed get isSecureStatusHidden() {
        const {
            isPageSecured, isFilteringEnabled, isHttpsFilteringEnabled,
            isExpired, isHttps,
        } = this.rootStore.settingsStore;

        return !!(!isPageSecured && (!isHttps || !isFilteringEnabled || isHttpsFilteringEnabled
            || this.isOpenCertificateModal || isExpired));
    }

    @computed get currentWorkingStatus() {
        const { isInstalled, isRunning, isProtectionEnabled } = this.rootStore.settingsStore;
        return { isInstalled, isRunning, isProtectionEnabled };
    }

    @action
    setReloading = (isReloading) => {
        this.isReloading = isReloading;
    };

    @action
    setAppWorkingStatus = (workingStatus) => {
        const { isAppUpToDate, isExtensionUpdated } = this.rootStore.settingsStore;

        const status = workingStatus || this.currentWorkingStatus;
        this.isAppWorking = (Object.values(status).every(state => state === true)
            && isAppUpToDate && isExtensionUpdated && !this.isReloading);

        this.setRequestStatus();
    };

    @action
    toggleOpenCertificateModal = () => {
        this.isOpenCertificateModal = !this.isOpenCertificateModal;
    };

    @action
    toggleShowInfo = () => {
        this.isInfoHovered = !this.isInfoHovered;
    };

    @action
    setPageFilteredByUserFilter = (isPageFilteredByUserFilter) => {
        this.isPageFilteredByUserFilter = isPageFilteredByUserFilter;
    };
}

export default UiStore;
