import { action, observable, computed } from 'mobx';

class UiStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable isOpenCertificateModal = false;

    @observable isInfoHovered = false;

    @observable isPageChanged = false;

    @observable isWorking = true;

    @observable isPending = true;

    @computed get switcherText() {
        return `${(this.rootStore.settingsStore.isFilteringEnabled || this.rootStore.settingsStore.isPageSecured) ? 'Enabled' : 'Disabled'} on this website`;
    }

    @computed get isSecureStatusHidden() {
        if (this.rootStore.uiStore.isOpenCertificateModal) {
            return true;
        }
        if (!this.rootStore.settingsStore.isPageSecured) {
            if (this.rootStore.settingsStore.isExpired
                || !this.rootStore.settingsStore.isHttpsFilteringEnabled) {
                return true;
            }
        }
        return false;
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
    toggleChange = () => {
        this.isPageChanged = !this.isPageChanged;
    }
}

export default UiStore;
