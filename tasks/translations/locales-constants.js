const fs = require('fs');
const path = require('path');
const inputConfig = require('./config.json');

const {
    twosky_config_path: TWOSKY_CONFIG_PATH,
    base_url: BASE_URL,
    source_relative_path: SRC_RELATIVE_PATH,
    supported_source_filename_extensions: SRC_FILENAME_EXTENSIONS,
    locales_relative_path: LOCALES_RELATIVE_PATH,
    locales_data_format: FORMAT,
    locales_data_filename: LOCALE_DATA_FILENAME,
    required_locales: REQUIRED_LOCALES,
    threshold_percentage: THRESHOLD_PERCENTAGE,
} = inputConfig;

const twoskyPath = path.join(__dirname, TWOSKY_CONFIG_PATH);
const twoskyContent = fs.readFileSync(twoskyPath, { encoding: 'utf8' });
const twoskyConfig = JSON.parse(twoskyContent)[0];

const {
    base_locale: BASE_LOCALE,
    project_id: PROJECT_ID,
    languages: LANGUAGES,
} = twoskyConfig;

module.exports = {
    BASE_LOCALE,
    PROJECT_ID,
    LANGUAGES,
    BASE_URL,
    SRC_RELATIVE_PATH,
    SRC_FILENAME_EXTENSIONS,
    LOCALES_RELATIVE_PATH,
    FORMAT,
    LOCALE_DATA_FILENAME,
    REQUIRED_LOCALES,
    THRESHOLD_PERCENTAGE,
};
