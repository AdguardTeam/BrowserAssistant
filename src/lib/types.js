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

export const HostRequestTypes = {
    hostRequest: 'hostRequest',
};

export const ResponseTypesPrefixes = {
    ADG: 'ADG',
    ADG_INIT: 'ADG_INIT',
};

export const AssistantTypes = {
    nativeAssistant: 'nativeAssistant',
    assistant: 'assistant',
    browserExtension: 'browserExtension',
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
