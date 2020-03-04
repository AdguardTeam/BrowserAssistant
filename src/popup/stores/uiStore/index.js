import {
    action, observable, computed, reaction,
} from 'mobx';
import {
    defaultModalState,
    eventTypeToModalStateMap,
    ORIGINAL_CERT_STATUS,
    HTTP_FILTERING_STATUS,
    secureStatusModalStates,
    SWITCHER_TRANSITION_TIME,
} from '../consts';
import { checkSomeIsTrue } from '../../../helpers';

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

    @observable userSettingsZoom = 1;

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
            pageProtocol, currentProtocol, originalCertStatus, isFilteringEnabled,
        } = this.rootStore.settingsStore;
        const { certStatus } = this;

        let modalInfo = secureStatusModalStates[currentProtocol];

        if (pageProtocol.isHttps) {
            modalInfo = modalInfo[originalCertStatus];

            if (certStatus.isValid) {
                const protectionStatus = isFilteringEnabled
                    ? HTTP_FILTERING_STATUS.ENABLED : HTTP_FILTERING_STATUS.DISABLED;

                modalInfo = modalInfo[protectionStatus];
            }
        }
        return modalInfo || secureStatusModalStates.default;
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
            isSetupCorrectly].every((state) => state === true);
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
    setExtensionLoading = (isLoading) => {
        this.isLoading = isLoading;
    };

    @action
    setExtensionPending = (isPending) => {
        this.isExtensionPending = isPending;
    };

    @action
    setExtensionLoadingAndPending = (isLoading = false, isPending = isLoading) => {
        this.setExtensionLoading(isLoading);
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

    @action
    getZoom = () => {
        const popupZoom = ((window.outerWidth - 8) / window.innerWidth) - 0.02;
        this.userSettingsZoom = popupZoom.toFixed(popupZoom < 3 ? 2 : 1);
    };

    resizeBody = reaction(
        () => this.userSettingsZoom,
        (userSettingsZoom) => {
            document.body.style.zoom = 1 / userSettingsZoom;
        }
    );

    closePopupWrapper = (fn) => () => {
        fn();
        window.close();
    };

    reloadPageAfterSwitcherTransition = () => {
        setTimeout(() => {
            adguard.tabs.reload();
        }, SWITCHER_TRANSITION_TIME);
    };
}

export default UiStore;
