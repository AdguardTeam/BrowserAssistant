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
    temporarilyDisableFiltering: 'temporarilyDisableFiltering',
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
    TEMPORARILY_DISABLE_FILTERING: 'popup.temporarily.disable.filtering',
    UPDATE_TEMPORARILY_DISABLE_FILTERING_TIMEOUT: 'popup.update.temporarily.disable.filtering.timeout',
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
