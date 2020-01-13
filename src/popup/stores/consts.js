export const protocolToPortMap = {
    'https:': 443,
    'http:': 80,
};

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
