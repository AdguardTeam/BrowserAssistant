export const REQUEST_TYPES = {
    init: 'init',
    getCurrentAppState: 'getCurrentAppState',
    getCurrentFilteringState: 'getCurrentFilteringState',
    setProtectionStatus: 'setProtectionStatus',
    setFilteringStatus: 'setFilteringStatus',
    addRule: 'addRule',
    removeCustomRules: 'removeCustomRules',
    openOriginalCert: 'openOriginalCert',
    reportSite: 'reportSite',
    openFilteringLog: 'openFilteringLog',
    openSettings: 'openSettings',
    updateApp: 'updateApp',
    pauseFiltering: 'pauseFiltering',
};

// Browser action popup messages
export const POPUP_MESSAGES = {
    STATE_UPDATED: 'popup.state.updated',
    GET_POPUP_DATA: 'popup.get.popup.data',
    GET_APP_LOCALE: 'popup.get.app.locale',
    GET_CURRENT_FILTERING_STATE: 'popup.get.current.filtering.state',
    GET_APP_STATE: 'popup.get.current.app.state',
    SET_PROTECTION_STATUS: 'popup.set.protection.status',
    REPORT_SITE: 'popup.report.site',
    RELOAD: 'popup.reload',
    REMOVE_CUSTOM_RULES: 'popup.remove.custom.rules',
    OPEN_FILTERING_LOG: 'popup.open.filtering.log',
    OPEN_SETTINGS: 'popup.open.settings',
    SET_FILTERING_STATUS: 'popup.set.filtering.status',
    OPEN_ORIGINAL_CERT: 'popup.open.original.cert',
    UPDATE_APP: 'popup.update.app',
    OPEN_PAGE: 'popup.open.page',
    INIT_ASSISTANT: 'popup.init.assistant',
    PAUSE_FILTERING: 'popup.pause.filtering',
    UPDATE_FILTERING_PAUSE_TIMEOUT: 'popup.update.filtering.pause.timeout',
    SHOW_RELOAD_BUTTON_FLAG: 'popup.show.reload.button.flag',
    GET_FILTERING_PAUSE_SUPPORTED_FLAG: 'popup.get.filtering.pause.supported.flag',
    GET_SHOW_RELOAD_BUTTON_FLAG: 'popup.get.show.reload.button.flag',
};

// Content script messages
export const CONTENT_MESSAGES = {
    GET_REFERRER: 'content.get.referrer',
    INIT_ASSISTANT: 'content.init.assistant',
    ADD_RULE: 'content.add.rule',
};

export const ADG_PREFIX = 'ADG';
export const CUSTOM_REQUEST_PREFIX = 'ADG_CUSTOM';

export const ASSISTANT_TYPES = {
    nativeAssistant: 'nativeAssistant',
};

export const HOST_TYPES = {
    browserExtensionHost: 'com.adguard.browser_extension_host.nm',
};
