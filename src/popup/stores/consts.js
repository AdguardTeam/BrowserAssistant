export const PROTOCOL_TO_PORT_MAP = {
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
    BYPASSED: 'cert_absent',
    NOTFOUND: 'cert_absent',
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

export const MODAL_STATES_NAMES = {
    isHovered: 'isHovered',
    isFocused: 'isFocused',
    isEntered: 'isEntered',
    isClicked: 'isClicked',
};

export const DEFAULT_MODAL_STATE = Object.values(MODAL_STATES_NAMES)
    .reduce((acc, name) => {
        acc[name] = false;
        return acc;
    }, {});

export const EVENT_TYPE_TO_MODAL_STATE_MAP = {
    mouseover: { [MODAL_STATES_NAMES.isHovered]: true },
    mouseout: { [MODAL_STATES_NAMES.isHovered]: false },
    focus: { [MODAL_STATES_NAMES.isFocused]: true },
    blur: { [MODAL_STATES_NAMES.isFocused]: false },
    keydown: { [MODAL_STATES_NAMES.isEntered]: true },
    mousedown: { [MODAL_STATES_NAMES.isClicked]: true },
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

const FILTERING_STATES_MODAL_INFO = {
    [HTTP_FILTERING_STATUS.ENABLED]: { info: 'protection_is_enabled' },
    [HTTP_FILTERING_STATUS.DISABLED]: { info: 'protection_is_disabled' },
};

export const SECURE_STATUS_MODAL_STATES = {
    [PROTOCOLS.HTTPS]: {
        [ORIGINAL_CERT_STATUS.INVALID]: { info: 'website_cert_is_expired' },
        [ORIGINAL_CERT_STATUS.NOTFOUND]: FILTERING_STATES_MODAL_INFO,
        [ORIGINAL_CERT_STATUS.BYPASSED]: FILTERING_STATES_MODAL_INFO,
        [ORIGINAL_CERT_STATUS.VALID]: FILTERING_STATES_MODAL_INFO,
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
    DEFAULT: {
        modalId: SECURE_STATUS_MODAL_IDS.BANK,
        message: 'not_filtering_https',
        header: 'secure_page',
        info: 'protection_is_enabled',
    },
};

export const SWITCHER_TRANSITION_TIME = 150;
