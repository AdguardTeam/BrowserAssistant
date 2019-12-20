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

export const ResponseTypesPrefixes = {
    ADG: 'ADG',
    INIT: 'INIT',
    ADG_INIT: 'ADG_INIT',
};

export const AssistantTypes = {
    nativeAssistant: 'nativeAssistant',
    assistant: 'assistant',
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
    CLOSE_POPUP: 'CLOSE_POPUP',
    SHOW_RELOAD: 'SHOW_RELOAD',
    SHOW_SETUP_INCORRECTLY: 'SHOW_SETUP_INCORRECTLY',
};
