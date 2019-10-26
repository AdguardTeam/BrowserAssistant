import { action, observable } from 'mobx';

class UiStore {
    @observable isOpenCertificateModal = false;

    @observable isInfoHovered = false;

    @observable isPageChanged = false;

    @observable isWorking = true;

    @observable isPending = true;

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
