const inputConfig = require('./config.json');

const {
    twosky_config_path: TWOSKY_CONFIG_PATH,
    base_url: BASE_URL,
    source_relative_path: SRC_RELATIVE_PATH,
    supported_source_filename_extensions: SRC_FILENAME_EXTENSIONS,
    persistent_messages: PERSISTENT_MESSAGES,
    locales_relative_path: LOCALES_RELATIVE_PATH,
    locales_data_format: FORMAT,
    locales_data_filename: LOCALE_DATA_FILENAME,
    required_locales: REQUIRED_LOCALES,
    threshold_percentage: THRESHOLD_PERCENTAGE,
} = inputConfig;

module.exports = {
    TWOSKY_CONFIG_PATH,
    BASE_URL,
    SRC_RELATIVE_PATH,
    SRC_FILENAME_EXTENSIONS,
    PERSISTENT_MESSAGES,
    LOCALES_RELATIVE_PATH,
    FORMAT,
    LOCALE_DATA_FILENAME,
    REQUIRED_LOCALES,
    THRESHOLD_PERCENTAGE,
};
