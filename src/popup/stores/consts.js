export const ORIGINAL_CERT_STATUS = {
    VALID: 'VALID',
    INVALID: 'INVALID',
    BYPASSED: 'BYPASSED',
    NOTFOUND: 'NOTFOUND',
};

export const CERT_STATES = {
    INVALID: 'the root certificate has expired',
    BYPASSED: 'site was bypassed',
    NOTFOUND: 'certificate wasn\'t found',
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

export const defaultModalState = {
    isHovered: false,
    isFocused: false,
    isEntered: false,
};
