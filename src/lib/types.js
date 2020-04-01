export const REQUEST_TYPES = {
    init: 'init',
    getCurrentAppState: 'getCurrentAppState',
    getCurrentFilteringState: 'getCurrentFilteringState',
    setProtectionStatus: 'setProtectionStatus',
    setFilteringStatus: 'setFilteringStatus',
    addRule: 'addRule',
    removeRule: 'removeRule',
    removeCustomRules: 'removeCustomRules',
    openOriginalCert: 'openOriginalCert',
    reportSite: 'reportSite',
    openFilteringLog: 'openFilteringLog',
    openSettings: 'openSettings',
    updateApp: 'updateApp',
};

export const TAB_ACTIONS = {
    openPage: 'openPage',
    reload: 'reload',
    getReferrer: 'getReferrer', // TODO use uppercase
    updateIconColor: 'updateIconColor',
    initAssistant: 'initAssistant',
};

export const BACKGROUND_COMMANDS = {
    SHOW_IS_NOT_INSTALLED: 'SHOW_IS_NOT_INSTALLED',
    START_RELOAD: 'START_RELOAD',
    STOP_RELOAD: 'STOP_RELOAD',
};

export const API_ACTIONS = {
    getUpdateStatusInfo: 'getUpdateStatusInfo',
};

export const HOST_RESPONSE_TYPES = {
    OK: 'ok',
    ERROR: 'error',
};

export const MESSAGE_TYPES = {
    ...REQUEST_TYPES,
    ...TAB_ACTIONS,
    ...API_ACTIONS,
    ...BACKGROUND_COMMANDS,
    ...HOST_RESPONSE_TYPES,
    STATE_UPDATED: 'stateUpdate',
    GET_POPUP_DATA: 'getPopupData',
};

export const HOST_REQUEST_TYPES = {
    hostRequest: 'hostRequest',
};

export const ADG_PREFIX = 'ADG';
export const CUSTOM_REQUEST_PREFIX = 'ADG_CUSTOM';

export const ASSISTANT_TYPES = {
    nativeAssistant: 'nativeAssistant',
};
export const CONTENT_MESSAGES = {
    getReferrer: 'getReferrer',
    initAssistant: 'initAssistant',
};

export const HOST_TYPES = {
    browserExtensionHost: 'com.adguard.browser_extension_host.nm',
};
