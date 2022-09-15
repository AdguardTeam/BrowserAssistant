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
    CONTACT_SUPPORT: 'popup.contact.support',
    GET_CONSENT_REQUIRED: 'popup.get.consent.required',
    GET_CURRENT_TAB: 'get.current.tab',
    GET_ACTIVE_AND_SIMILAR_TABS: 'get.active.and.similar.tabs',
};

// Content script messages
export const CONTENT_MESSAGES = {
    GET_REFERRER: 'content.get.referrer',
    INIT_ASSISTANT: 'content.init.assistant',
    ADD_RULE: 'content.add.rule',
};

export const POST_INSTALL_MESSAGES = {
    UNINSTALL_EXTENSION: 'postinstall.uninstall.extension',
    AGREE_WITH_CONDITIONS: 'postinstall.agree.with.conditions',
};

export const OPTIONS_UI_MESSAGES = {
    SET_SETTING: 'options.ui.set.setting',
    GET_SETTING: 'options.ui.get.setting',
};

export const ADG_PREFIX = 'ADG';
export const CUSTOM_REQUEST_PREFIX = 'ADG_CUSTOM';

export const ASSISTANT_TYPES = {
    nativeAssistant: 'nativeAssistant',
};

export const HOST_TYPES = {
    browserExtensionHost: 'com.adguard.browser_extension_host.nm',
};

export const SETTINGS = {
    CONTEXT_MENU_ENABLED: 'context_menu_enabled',
};

export const BACKGROUND_MESSAGES = {
    CLOSE_POPUP: 'close.popup',
};

export const FEEDBACK_ACTIONS = {
    UPDATE_FILTERING_STATUS: 'updateFilteringStatus',
    UPDATE_APPLICATION_APP_ONLY: 'updateApplicationAppOnly',
};

export const APP_VERSION_KEY = 'update.service.app.version';
