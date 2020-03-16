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
    getReferrer: 'getReferrer',
    updateIconColor: 'updateIconColor',
    getCurrentTabUrlProperties: 'getCurrentTabUrlProperties',
    initAssistant: 'initAssistant',
};

export const BACKGROUND_COMMANDS = {
    SHOW_IS_NOT_INSTALLED: 'SHOW_IS_NOT_INSTALLED',
    SHOW_RELOAD: 'SHOW_RELOAD',
    SHOW_SETUP_INCORRECT: 'SHOW_SETUP_INCORRECT',
};

export const API_ACTIONS = {
    getUpdateStatusInfo: 'getUpdateStatusInfo',
};


export const HOST_RESPONSE_TYPES = {
    OK: 'OK',
    ERROR: 'ERROR',
};

export const MESSAGE_TYPES = {
    ...REQUEST_TYPES,
    ...TAB_ACTIONS,
    ...API_ACTIONS,
    ...BACKGROUND_COMMANDS,
    ...HOST_RESPONSE_TYPES,
};

export const HOST_REQUEST_TYPES = {
    hostRequest: 'hostRequest',
};

export const RESPONSE_TYPE_PREFIXES = {
    ADG: 'ADG',
};

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

export const SETUP_STATES = {
    isAppUpToDate: 'isAppUpToDate',
    isExtensionUpdated: 'isExtensionUpdated',
    isSetupCorrect: 'isSetupCorrect',
};
