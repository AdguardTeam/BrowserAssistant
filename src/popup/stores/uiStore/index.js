import {
    action,
    observable,
    computed,
    makeObservable,
} from 'mobx';

import {
    DEFAULT_MODAL_STATE,
    EVENT_TYPE_TO_MODAL_STATE_MAP,
    ORIGINAL_CERT_STATUS,
    HTTP_FILTERING_STATUS,
    SECURE_STATUS_MODAL_STATES,
} from '../consts';
import { checkSomeIsTrue } from '../../../lib/helpers';

class UiStore {
    constructor(rootStore) {
        makeObservable(this);
        this.rootStore = rootStore;
    }

    /**
     * Flag shows that extension has started to get information from native host on first start
     * @type {boolean}
     */
    @observable isLoading = true;

    /**
     * Flag is set to the true when popup executes requests to the background
     * @type {boolean}
     */
    @observable isPending = false;

    @observable certStatusModalState = { ...DEFAULT_MODAL_STATE };

    @observable secureStatusModalState = { ...DEFAULT_MODAL_STATE };

    @computed get isCertStatusModalOpen() {
        return checkSomeIsTrue(this.certStatusModalState);
    }

    @computed get isPageStatusModalOpen() {
        return checkSomeIsTrue(this.secureStatusModalState);
    }

    @computed get globalTabIndex() {
        return (this.isLoading ? -1 : 0);
    }

    @computed get secureStatusModalInfo() {
        const {
            pageProtocol, currentProtocol, originalCertStatus, isFilteringEnabled,
        } = this.rootStore.settingsStore;

        const { certStatus } = this;

        let MODAL_INFO = SECURE_STATUS_MODAL_STATES[currentProtocol];

        if (pageProtocol.isHttps) {
            MODAL_INFO = MODAL_INFO[originalCertStatus];

            if (!certStatus.isInvalid) {
                const PROTECTION_STATUS = isFilteringEnabled
                    ? HTTP_FILTERING_STATUS.ENABLED : HTTP_FILTERING_STATUS.DISABLED;

                MODAL_INFO = MODAL_INFO[PROTECTION_STATUS];
            }
        }
        return MODAL_INFO || SECURE_STATUS_MODAL_STATES.DEFAULT;
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
        this.isPending = isPending;
    };
}

export default UiStore;
