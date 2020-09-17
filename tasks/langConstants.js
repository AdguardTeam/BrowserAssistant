/**
 * DO NOT IMPORT IN THIS FILE ANYTHING, BECAUSE IT IS ALSO USED IN EXTENSION CODEBASE
 */

const [twoskyConfig] = require('../.twosky.json');
const BASE_LOCALE_CONTENT = require('../src/_locales/en/messages.json');

const { base_locale: BASE_LOCALE, project_id: PROJECT_ID, languages: LANGUAGES } = twoskyConfig;

module.exports = {
    BASE_LOCALE,
    BASE_LOCALE_CONTENT,
    PROJECT_ID,
    LANGUAGES,
};
