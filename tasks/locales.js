/* eslint-disable no-console, no-await-in-loop */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const querystring = require('querystring');
const {
    BASE_LOCALE, BASE_LOCALE_CONTENT, PROJECT_ID, LANGUAGES,
} = require('./langConstants');

const BASE_URL = 'https://twosky.adtidy.org/api/v1';
const BASE_DOWNLOAD_URL = `${BASE_URL}/download`;
const BASE_UPLOAD_URL = `${BASE_URL}/upload`;
const FORMAT = 'json';
const FILENAME = `messages.${FORMAT}`;
const LOCALES = Object.keys(LANGUAGES);// locales which will be downloaded
const LOCALES_DIR = path.resolve(__dirname, '../src/_locales');
const SRC_DIR = path.resolve(__dirname, '../src');

const REQUIRED_LVL_OF_TRANSLATIONS = 100;
const REQUIRED_LOCALES = ['ru', 'de', 'fr', 'ja', 'zh_CN'];

/**
 * Build query string for downloading translations
 * @param {string} lang locale code
 */
const getQueryString = (lang) => querystring.stringify({
    format: FORMAT,
    language: lang,
    project: PROJECT_ID,
    filename: FILENAME,
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
    formData.append('filename', FILENAME);
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
async function downloadAndSave() {
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const lang of LOCALES) {
        const downloadUrl = `${BASE_DOWNLOAD_URL}?${getQueryString(lang)}`;
        try {
            console.log(`Downloading: ${downloadUrl}`);
            const { data } = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
            const filePath = path.join(LOCALES_DIR, lang, FILENAME);
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
async function upload() {
    const filePath = path.join(LOCALES_DIR, BASE_LOCALE, FILENAME);
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
    const filePath = path.join(LOCALES_DIR, locale, FILENAME);
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
        return result.level < REQUIRED_LVL_OF_TRANSLATIONS;
    });

    if (summary) {
        printTranslationsResults(results);
    } else if (filteredResults.length > 0) {
        printTranslationsResults(filteredResults);
        throw new Error('Locales above should be done ready for 100%.');
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

const contains = (key, files) => {
    for (let i = 0; i < files.length; i += 1) {
        if (files[i].includes(key)) {
            return true;
        }
    }
    return false;
};

const checkUnusedMessages = () => {
    const files = [];

    traverseDir(SRC_DIR, (path) => {
        const canContain = (path.endsWith('.js') || path.endsWith('.json'))
            && !path.includes(LOCALES_DIR);

        if (canContain) {
            files.push(fs.readFileSync(path).toString());
        }
    });

    const unused = [];
    Object.keys(BASE_LOCALE_CONTENT).forEach((key) => {
        if (!contains(key, files)) {
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

/**
 * You need set environment variable LOCALES=DOWNLOAD|UPLOAD when run the script
 */
if (process.env.LOCALES === 'DOWNLOAD') {
    downloadAndSave()
        .then(() => {
            console.log('Download was successful');
        })
        .catch((e) => {
            console.log(e.message);
            process.exit(1);
        });
} else if (process.env.LOCALES === 'UPLOAD') {
    upload()
        .then((result) => {
            console.log(`Upload was successful with response: ${JSON.stringify(result)}`);
        })
        .catch((e) => {
            console.log(e.message);
            process.exit(1);
        });
} else if (process.env.LOCALES === 'CHECK_OUR') {
    checkTranslations(REQUIRED_LOCALES)
        .then(() => {
            console.log('Our languages have required level of translations');
        })
        .catch((e) => {
            console.log(e.message);
            process.exit(1);
        });
} else if (process.env.LOCALES === 'VALIDATE_ALL') {
    checkTranslations(LOCALES)
        .then(() => {
            console.log('All languages have required level of translations');
        })
        .catch((e) => {
            console.log(e.message);
            process.exit(1);
        });
} else if (process.env.SUMMARY) {
    checkTranslations(LOCALES, process.env.SUMMARY)
        .then(() => {})
        .catch((e) => {
            console.log(e.message);
            process.exit(1);
        });
} else if (process.env.UNUSED) {
    checkUnusedMessages();
} else {
    console.log('Option DOWNLOAD/UPLOAD locales is not set');
}
