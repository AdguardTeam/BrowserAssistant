/**
 * DO NOT IMPORT IN THIS FILE ANYTHING, BECAUSE IT IS ALSO USED IN EXTENSION CODEBASE
 */

const [twoskyConfig] = require('../.twosky.json');

const { base_locale: BASE_LOCALE, project_id: PROJECT_ID, languages: LANGUAGES } = twoskyConfig;

/**
 * Users locale may be defined with only two chars (language code)
 * Here we provide a map of equivalent translation for such locales
 */
const LOCALES_EQUIVALENTS_MAP = {
    'pt-BR': 'pt',
    'zh-CN': 'zh',
};

module.exports = {
    BASE_LOCALE,
    PROJECT_ID,
    LANGUAGES,
    LOCALES_EQUIVALENTS_MAP,
};
