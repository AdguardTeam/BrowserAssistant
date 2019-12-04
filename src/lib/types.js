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
    startApp: 'startApp',
    updateApp: 'updateApp',
};

export const ResponseTypes = {
    APP_STATE_RESPONSE_MESSAGE: 'APP_STATE_RESPONSE_MESSAGE',
    INIT: 'INIT',
    ADG_INIT: 'ADG_INIT',
    ADG: 'ADG',
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
    browserExtensionHost: 'browser_extension_host',
};

export const BACKGROUND_COMMANDS = {
    CLOSE_POPUP: 'CLOSE_POPUP',
    SHOW_RELOAD: 'SHOW_RELOAD',
};
