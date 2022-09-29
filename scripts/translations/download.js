/* eslint-disable no-await-in-loop */
import { getLocaleTranslations } from './helpers';
import { BASE_LOCALE, PERSISTENT_MESSAGES } from './locales-constants';

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const querystring = require('querystring');

const { log } = require('./helpers');

const {
    PROJECT_ID,
    API_URL,
    LOCALES_RELATIVE_PATH,
    FORMAT,
    LOCALE_DATA_FILENAME,
} = require('./locales-constants');

const API_DOWNLOAD_URL = `${API_URL}/download`;
const LOCALES_DIR = path.resolve(__dirname, LOCALES_RELATIVE_PATH);

/**
 * Build query string for downloading translations
 * @param {string} lang locale code
 */
const getQueryString = (lang) => querystring.stringify({
    format: FORMAT,
    language: lang,
    project: PROJECT_ID,
    filename: LOCALE_DATA_FILENAME,
});

/**
 * Save file by path with passed content
 * @param {string} filePath path to file
 * @param {any} data arraybuffer
 */
function saveFile(filePath, data) {
    const formattedData = data.toString().trim();

    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }

    return fs.promises.writeFile(filePath, formattedData);
}

const downloadAndSaveLocales = async (locales) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const lang of locales) {
        const downloadUrl = `${API_DOWNLOAD_URL}?${getQueryString(lang)}`;
        try {
            log.info(`Downloading: ${downloadUrl}`);
            const { data } = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
            const filePath = path.join(LOCALES_DIR, lang, LOCALE_DATA_FILENAME);
            await saveFile(filePath, data);
            log.info(`Successfully saved in: ${filePath}`);
        } catch (e) {
            let errorMessage;
            if (e.response && e.response.data) {
                const decoder = new TextDecoder();
                errorMessage = decoder.decode(e.response.data);
            } else {
                errorMessage = e.message;
            }
            throw new Error(`Error occurred: ${errorMessage}, while downloading: ${downloadUrl}`);
        }
    }
};

const checkRequiredFields = (locale, messages, baseMessages) => {
    const requiredFields = PERSISTENT_MESSAGES;
    const resultMessages = { ...messages };
    requiredFields.forEach((requiredField) => {
        const fieldData = resultMessages[requiredField];
        if (!fieldData) {
            log.info(` - "${locale}" locale doesn't have required field: "${requiredField}"`);
            log.info('   Will be added message from base locale');
            resultMessages[requiredField] = baseMessages[requiredField];
        }
    });
    return resultMessages;
};

const validateRequiredFields = async (locales) => {
    const baseMessages = await getLocaleTranslations(
        LOCALES_DIR,
        BASE_LOCALE,
        LOCALE_DATA_FILENAME,
    );

    const promises = locales.map(async (locale) => {
        const pathToLocale = path.join(LOCALES_DIR, locale, LOCALE_DATA_FILENAME);
        const messages = JSON.parse(await fs.promises.readFile(pathToLocale, 'utf-8'));
        const checkedMessages = checkRequiredFields(locale, messages, baseMessages);
        const checkedMessagesString = JSON.stringify(checkedMessages, null, 4).replace(/\//g, '\\/');
        await fs.promises.writeFile(pathToLocale, checkedMessagesString);
    });

    await Promise.all(promises);
};

/**
 * Entry point for downloading translations
 */
export const downloadAndSave = async (locales) => {
    await downloadAndSaveLocales(locales);
    await validateRequiredFields(locales);
};
