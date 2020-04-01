import {
    action, observable, computed,
} from 'mobx';
import {
    DEFAULT_MODAL_STATE,
    EVENT_TYPE_TO_MODAL_STATE_MAP,
    ORIGINAL_CERT_STATUS,
    HTTP_FILTERING_STATUS,
    SECURE_STATUS_MODAL_STATES,
    SWITCHER_TRANSITION_TIME,
} from '../consts';
import { checkSomeIsTrue } from '../../../lib/helpers';
import innerMessaging from '../../../lib/innerMessaging';
import tabs from '../../../background/tabs';

class UiStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    @observable isPageFilteredByUserFilter = false;

    @observable isLoading = false;

    @observable isProtectionTogglePending = false;

    @observable isExtensionPending = true;

    @observable certStatusModalState = { ...DEFAULT_MODAL_STATE };

    @observable secureStatusModalState = { ...DEFAULT_MODAL_STATE };

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

        let modalInfo = SECURE_STATUS_MODAL_STATES[currentProtocol];

        if (pageProtocol.isHttps) {
            modalInfo = modalInfo[originalCertStatus];

            if (certStatus.isValid) {
                const protectionStatus = isFilteringEnabled
                    ? HTTP_FILTERING_STATUS.ENABLED : HTTP_FILTERING_STATUS.DISABLED;

                modalInfo = modalInfo[protectionStatus];
            }
        }
        return modalInfo || SECURE_STATUS_MODAL_STATES.default;
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

    // TODO get from background page
    @computed get isAppWorking() {
        const {
            isAppUpToDate,
            isValidatedOnHost,
            isInstalled,
            isRunning,
            isProtectionEnabled,
        } = this.rootStore.settingsStore;

        return [isInstalled,
            isRunning,
            isProtectionEnabled,
            isAppUpToDate,
            isValidatedOnHost,
        ].every((state) => state === true);
    }

    @action
    updateCertStatusModalState = (eventType,
        newState = EVENT_TYPE_TO_MODAL_STATE_MAP[eventType]) => {
        this.certStatusModalState = {
            ...this.certStatusModalState,
            ...newState,
        };
    };

    @action
    resetCertStatusModalState = () => {
        this.certStatusModalState = DEFAULT_MODAL_STATE;
    };

    @action
    updateSecureStatusModalState = (eventType,
        newState = EVENT_TYPE_TO_MODAL_STATE_MAP[eventType]) => {
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
    setPageFilteredByUserFilter = (isPageFilteredByUserFilter) => {
        this.isPageFilteredByUserFilter = isPageFilteredByUserFilter;
    };

    @action
    setProtectionTogglePending = (isProtectionTogglePending) => {
        this.isProtectionTogglePending = isProtectionTogglePending;
    };

    // TODO consider removing
    reloadPageAfterSwitcherTransition = () => {
        setTimeout(async () => {
            const tab = await tabs.getCurrent();
            await innerMessaging.reload(tab);
        }, SWITCHER_TRANSITION_TIME);
    };
}

export default UiStore;
