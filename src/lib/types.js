export const RequestTypes = {
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

export const TabActions = {
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

export const HostRequestTypes = {
    hostRequest: 'hostRequest',
};

export const ResponseTypesPrefixes = {
    ADG: 'ADG',
    ADG_INIT: 'ADG_INIT',
};

export const AssistantTypes = {
    nativeAssistant: 'nativeAssistant',
};

export const MessageTypes = {
    getReferrer: 'getReferrer',
    initAssistant: 'initAssistant',
};

export const HostResponseTypes = {
    ok: 'ok',
    error: 'error',
};

export const HostTypes = {
    browserExtensionHost: 'com.adguard.browser_extension_host.nm',
};

export const BACKGROUND_COMMANDS = {
    SHOW_IS_NOT_INSTALLED: 'SHOW_IS_NOT_INSTALLED',
    SHOW_RELOAD: 'SHOW_RELOAD',
    SHOW_SETUP_INCORRECTLY: 'SHOW_SETUP_INCORRECTLY',
};

export const setupStates = {
    isAppUpToDate: 'isAppUpToDate',
    isExtensionUpdated: 'isExtensionUpdated',
    isSetupCorrectly: 'isSetupCorrectly',
};

export const apiTypes = {
    requests: 'requests',
    tabs: 'tabs',
};
