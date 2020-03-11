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

export const INNER_MESSAGING_TYPES = {
    API_REQUEST: 'API_REQUEST',
    TAB_ACTION: 'TAB_ACTION',
};

export const HOST_REQUEST_TYPES = {
    hostRequest: 'hostRequest',
};

export const RESPONSE_TYPE_PREFIXES = {
    ADG: 'ADG',
    ADG_INIT: 'ADG_INIT',
};

export const ASSISTANT_TYPES = {
    nativeAssistant: 'nativeAssistant',
};

export const MESSAGE_TYPES = {
    getReferrer: 'getReferrer',
    initAssistant: 'initAssistant',
};

export const HOST_RESPONSE_TYPES = {
    ok: 'ok',
    error: 'error',
};

export const HOST_TYPES = {
    browserExtensionHost: 'com.adguard.browser_extension_host.nm',
};

export const BACKGROUND_COMMANDS = {
    SHOW_IS_NOT_INSTALLED: 'SHOW_IS_NOT_INSTALLED',
    SHOW_RELOAD: 'SHOW_RELOAD',
    SHOW_SETUP_INCORRECT: 'SHOW_SETUP_INCORRECT',
};

export const SETUP_STATES = {
    isAppUpToDate: 'isAppUpToDate',
    isExtensionUpdated: 'isExtensionUpdated',
    isSetupCorrect: 'isSetupCorrect',
};

export const API_TYPES = {
    requests: 'requests',
    tabs: 'tabs',
};
