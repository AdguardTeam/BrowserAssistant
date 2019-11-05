import {
    action, observable, computed,
} from 'mobx';

class UiStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable isOpenCertificateModal = false;

    @observable isInfoHovered = false;

    @observable isPageChanged = false;

    @observable isAppWorking = true;

    @computed get securityModalState() {
        const {
            isPageSecured, isProtectionEnabled, isHttps, isFilteringEnabled,
            isHttpsFilteringEnabled,
        } = this.rootStore.settingsStore;
        if (isPageSecured || !isProtectionEnabled || !isHttps || !isFilteringEnabled
            || (isFilteringEnabled && isHttpsFilteringEnabled)) {
            return ({
                cn: 'modal modal__secure-page',
                message: 'Nothing to block here',
            });
        }
        return ({
            cn: 'modal modal__secure-page modal__secure-page--bank',
            message: `By default, we don't filter HTTPS traffic for the payment system and bank websites.
            You can enable the filtering yourself: tap on the yellow 'lock' on the left.`,
        });
    }

    @computed get switcherText() {
        return `${(this.rootStore.settingsStore.isFilteringEnabled) ? 'Enabled' : 'Disabled'} on this website`;
    }

    @computed get isSecureStatusHidden() {
        const {
            isPageSecured, isFilteringEnabled, isHttpsFilteringEnabled,
            isExpired, isHttps,
        } = this.rootStore.settingsStore;

        if (!isFilteringEnabled
            || (!isFilteringEnabled && !isHttps)
            || (!isPageSecured && !isHttps)) {
            return true;
        }
        if (isPageSecured
            && isFilteringEnabled) {
            return false;
        }

        return this.isOpenCertificateModal || isHttpsFilteringEnabled || isExpired;
    }

    @action
    setAppWorkingStatus = (isWorking) => {
        this.isAppWorking = isWorking;
        return this.isAppWorking;
    }

    @action
    toggleOpenCertificateModal = () => {
        this.isOpenCertificateModal = !this.isOpenCertificateModal;
    };

    @action
    toggleShowInfo = () => {
        this.isInfoHovered = !this.isInfoHovered;
    };

    @action
    setPageChanged = (isPageChanged) => {
        this.isPageChanged = isPageChanged;
    };
}

export default UiStore;
