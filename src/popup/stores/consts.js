export const protocolToPortMap = {
    HTTPS: 443,
    HTTP: 80,
    SECURED: 0,
};

export const ORIGINAL_CERT_STATUS = {
    VALID: 'VALID',
    INVALID: 'INVALID',
    BYPASSED: 'BYPASSED',
    NOTFOUND: 'NOTFOUND',
};

export const CERT_STATES = {
    INVALID: 'cert_expired',
    BYPASSED: 'cert_bypassed',
    NOTFOUND: 'cert_notfound',
};

export const WORKING_STATES = {
    IS_APP_INSTALLED: 'IS_APP_INSTALLED',
    IS_APP_RUNNING: 'IS_APP_RUNNING',
    IS_APP_UP_TO_DATE: 'IS_APP_UP_TO_DATE',
    IS_APP_SETUP_CORRECTLY: 'IS_APP_SETUP_CORRECTLY',
    IS_EXTENSION_UPDATED: 'IS_EXTENSION_UPDATED',
    IS_EXTENSION_RELOADING: 'IS_EXTENSION_RELOADING',
    IS_PROTECTION_ENABLED: 'IS_PROTECTION_ENABLED',
};

export const SWITCHER_IDS = {
    HTTPS_SWITCHER: 'https-switcher',
    GLOBAL_SWITCHER: 'global-switcher',
};

export const SECURE_STATUS_MODAL_IDS = {
    SECURE: 'SECURE',
    NOT_SECURE: 'NOT_SECURE',
    BANK: 'BANK',
};

export const SHOW_MODAL_TIME = {
    SHORT: 1000,
    LONG: 5000,
};

export const modalStatesNames = {
    isHovered: 'isHovered',
    isFocused: 'isFocused',
    isEntered: 'isEntered',
    isClicked: 'isClicked',
};

export const defaultModalState = Object.values(modalStatesNames).reduce((states, name) => {
    // eslint-disable-next-line no-param-reassign
    states[name] = false;
    return states;
}, {});


export const eventTypeToModalStateMap = {
    mouseover: { [modalStatesNames.isHovered]: true },
    mouseout: { [modalStatesNames.isHovered]: false },
    focus: { [modalStatesNames.isFocused]: true },
    blur: { [modalStatesNames.isFocused]: false },
    keydown: { [modalStatesNames.isEntered]: true },
    mousedown: { [modalStatesNames.isClicked]: true },
};

export const PROTOCOLS = {
    HTTPS: 'HTTPS',
    HTTP: 'HTTP',
    SECURED: 'SECURED',
};

export const HTTP_FILTERING_STATUS = {
    ENABLED: 'ENABLED',
    DISABLED: 'DISABLED',
};

export const secureStatusModalStates = {
    [PROTOCOLS.HTTPS]: {
        [ORIGINAL_CERT_STATUS.INVALID]: { info: 'website_cert_is_expired' },
        [ORIGINAL_CERT_STATUS.NOTFOUND]: { info: 'website_cert_was_not_found' },
        [ORIGINAL_CERT_STATUS.BYPASSED]: { info: '' },
        [ORIGINAL_CERT_STATUS.VALID]: {
            [HTTP_FILTERING_STATUS.ENABLED]: { info: 'protection_is_enabled' },
            [HTTP_FILTERING_STATUS.DISABLED]: { info: 'protection_is_disabled' },
        },
    },
    [PROTOCOLS.HTTP]: {
        modalId: SECURE_STATUS_MODAL_IDS.NOT_SECURE,
        message: 'site_not_using_private_protection',
        header: 'not_secure',
        info: 'not_secure',
    },
    [PROTOCOLS.SECURED]: {
        modalId: SECURE_STATUS_MODAL_IDS.SECURE,
        message: 'nothing_to_block_here',
        header: 'secure_page',
        info: 'secure_page',
    },
    default: {
        modalId: SECURE_STATUS_MODAL_IDS.BANK,
        message: 'not_filtering_https',
        header: 'secure_page',
        info: 'protection_is_enabled',
    },
};
