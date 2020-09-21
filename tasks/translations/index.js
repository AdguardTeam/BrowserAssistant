/* eslint-disable no-console, no-await-in-loop */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const querystring = require('querystring');
const { program } = require('commander');

const {
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
} = require('./langConstants');

const BASE_DOWNLOAD_URL = `${BASE_URL}/download`;
const BASE_UPLOAD_URL = `${BASE_URL}/upload`;
const LOCALES = Object.keys(LANGUAGES);// locales which will be downloaded
const LOCALES_DIR = path.resolve(__dirname, LOCALES_RELATIVE_PATH);
const SRC_DIR = path.resolve(__dirname, SRC_RELATIVE_PATH);

const BASE_LOCALE_CONTENT_LOCATION = `${LOCALES_RELATIVE_PATH}/${BASE_LOCALE}/${LOCALE_DATA_FILENAME}`;
// eslint-disable-next-line import/no-dynamic-require
const BASE_LOCALE_CONTENT = require(BASE_LOCALE_CONTENT_LOCATION);

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
 * Build form data for uploading translation
 * @param {string} filePath
 */
const getFormData = (filePath) => {
    const formData = new FormData();

    formData.append('format', FORMAT);
    formData.append('language', BASE_LOCALE);
    formData.append('project', PROJECT_ID);
    formData.append('filename', LOCALE_DATA_FILENAME);
    formData.append('file', fs.createReadStream(filePath));

    return formData;
};

/**
 * Save file by path with passed content
 * @param {string} filePath path to file
 * @param {any} data arraybuffer
 */
function saveFile(filePath, data) {
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    return fs.promises.writeFile(filePath, data);
}

/**
 * Entry point for downloading translations
 */
async function downloadAndSave(locales) {
    // eslint-disable-next-line no-restricted-syntax
    for (const lang of locales) {
        const downloadUrl = `${BASE_DOWNLOAD_URL}?${getQueryString(lang)}`;
        try {
            console.log(`Downloading: ${downloadUrl}`);
            const { data } = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
            const filePath = path.join(LOCALES_DIR, lang, LOCALE_DATA_FILENAME);
            await saveFile(filePath, data);
            console.log(`Successfully saved in: ${filePath}`);
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
}

/**
 * Entry point for uploading translations
 */
async function uploadBaseLocale() {
    const filePath = path.join(LOCALES_DIR, BASE_LOCALE, LOCALE_DATA_FILENAME);
    const formData = getFormData(filePath);
    let response;

    try {
        response = await axios.post(BASE_UPLOAD_URL, formData, {
            contentType: 'multipart/form-data',
            headers: formData.getHeaders(),
        });
    } catch (e) {
        throw new Error(`Error: ${e.message}, while uploading: ${BASE_UPLOAD_URL}`);
    }

    return response.data;
}

const getLocaleTranslations = async (locale) => {
    const filePath = path.join(LOCALES_DIR, locale, LOCALE_DATA_FILENAME);
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
};

const printTranslationsResults = (results) => {
    console.log('Translations readiness:');
    results.forEach((e) => {
        console.log(`${e.locale} -- ${e.level}%`);
    });
};

const checkTranslations = async (locales, summary = false) => {
    const baseLocaleTranslations = await getLocaleTranslations(BASE_LOCALE);
    const baseLocaleMessagesCount = Object.keys(baseLocaleTranslations).length;

    const results = await Promise.all(locales.map(async (locale) => {
        const localeTranslations = await getLocaleTranslations(locale);
        const localeMessagesCount = Object.keys(localeTranslations).length;
        const strictLevel = ((localeMessagesCount / baseLocaleMessagesCount) * 100);
        const level = Math.round((strictLevel + Number.EPSILON) * 100) / 100;
        return { locale, level, translated: localeMessagesCount };
    }));

    const filteredResults = results.filter((result) => {
        return result.level < THRESHOLD_PERCENTAGE;
    });

    if (summary) {
        printTranslationsResults(results);
    } else if (filteredResults.length > 0) {
        printTranslationsResults(filteredResults);
        throw new Error('Locales above should be done for 100%.');
    }

    return results;
};

const traverseDir = (dir, callback) => {
    fs.readdirSync(dir).forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
            traverseDir(fullPath, callback);
        } else {
            callback(fullPath);
        }
    });
};

const canContainLocalesStrings = (path) => {
    let isSupportedExtension = false;
    for (let i = 0; i < SRC_FILENAME_EXTENSIONS.length; i += 1) {
        isSupportedExtension = path.endsWith(SRC_FILENAME_EXTENSIONS[i]) || isSupportedExtension;
    }

    return isSupportedExtension && !path.includes(LOCALES_DIR);
};

const checkUnusedMessages = () => {
    const filesContents = [];

    traverseDir(SRC_DIR, (path) => {
        if (canContainLocalesStrings(path)) {
            filesContents.push(fs.readFileSync(path).toString());
        }
    });

    const unused = [];
    Object.keys(BASE_LOCALE_CONTENT).forEach((key) => {
        if (!filesContents.some((f) => f.includes(key))) {
            unused.push(key);
        }
    });

    if (unused.length > 0) {
        console.log('Unused messages:');
        unused.forEach((key) => {
            console.log(key);
        });
        throw new Error('There should be no unused messages.');
    } else {
        console.log('There is no unused messages.');
    }
};

const download = async (locales) => {
    try {
        await downloadAndSave(locales);
        console.log('Download was successful');
        await checkTranslations(locales);
        console.log('Locales have required level of translations');
    } catch (e) {
        console.log(e.message);
        process.exit(1);
    }
};

const upload = async () => {
    try {
        const result = await uploadBaseLocale();
        console.log(`Upload was successful with response: ${JSON.stringify(result)}`);
    } catch (e) {
        console.log(e.message);
        process.exit(1);
    }
};

const validate = async (locales) => {
    try {
        await checkTranslations(locales);
        console.log('Locales have required level of translations');
    } catch (e) {
        console.log(e.message);
        process.exit(1);
    }
};

const summary = async () => {
    try {
        await checkTranslations(LOCALES, true);
    } catch (e) {
        console.log(e.message);
        process.exit(1);
    }
};

const unused = async () => {
    try {
        await checkUnusedMessages();
    } catch (e) {
        console.log(e.message);
        process.exit(1);
    }
};

program
    .command('info')
    .description('Shows locales info')
    .option('-s,--summary', 'for all locales translations readiness')
    .option('-N,--unused', 'for unused base-lang strings')
    .action((opts) => {
        if (opts.summary && !opts.unused) {
            summary();
        } else if (!opts.summary && opts.unused) {
            unused();
        } else {
            summary();
            unused();
        }
    });

program
    .command('download')
    .description('Downloads messages from localization service')
    .option('-l,--locales [list...]', 'specific list of space-separated locales')
    .action((opts) => {
        const locales = opts.locales && opts.locales.length > 0 ? opts.locales : LOCALES;
        download(locales);
    });

program
    .command('upload')
    .description('Uploads base messages to the localization service')
    .action(upload);

program
    .command('validate')
    .description('Validates translations')
    .option('-R,--min', 'for only our required locales')
    .option('-l,--locales [list...]', 'for specific list of space-separated locales')
    .action((opts) => {
        let locales;
        if (opts.min) {
            locales = REQUIRED_LOCALES;
        } else if (opts.locales && opts.locales.length > 0) {
            locales = opts.locales;
        } else {
            // defaults to validate all locales
            locales = LOCALES;
        }
        validate(locales);
    });

program.parse(process.argv);
