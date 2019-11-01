import {
    action, observable, computed, runInAction,
} from 'mobx';

class UiStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable isOpenCertificateModal = false;

    @observable isInfoHovered = false;

    @observable isPageChanged = false;

    @observable isAppWorking = true;

    @observable isPending = true;

    @computed get switcherText() {
        return `${(this.rootStore.settingsStore.isFilteringEnabled) ? 'Enabled' : 'Disabled'} on this website`;
    }

    @computed get isSecureStatusHidden() {
        if (this.rootStore.settingsStore.isPageSecured
            && this.rootStore.settingsStore.isFilteringEnabled) { return false; }

        if (this.rootStore.uiStore.isOpenCertificateModal
            || this.rootStore.settingsStore.isHttpsFilteringEnabled
            || this.rootStore.settingsStore.isExpired) {
            return true;
        }

        return false;
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
    }

    @action
    getStatusIsPageChanged = () => {
        const { isPageChanged } = adguard.tabs;
        runInAction(() => {
            this.isPageChanged = isPageChanged;
            return this.isPageChanged;
        });
    };
}

export default UiStore;
