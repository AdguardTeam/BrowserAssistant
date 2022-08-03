const path = require('path');

const SRC_PATH = '../src';
const LOCALES_PATH = path.join(__dirname, SRC_PATH, '_locales/en/messages');

const BUILD_ENVS = {
    DEV: 'dev',
    BETA: 'beta',
    RELEASE: 'release',
};

const BUILD_ENVS_MAP = {
    dev: {
        outputPath: 'dev',
        name: 'Dev',
    },
    beta: {
        outputPath: 'beta',
        name: 'Beta',
    },
    release: {
        outputPath: 'release',
        name: '',
    },
};

const BROWSER_TYPES = {
    CHROME: 'chrome',
    FIREFOX: 'firefox',
    EDGE: 'edge',
};

// Build output path
const BUILD_PATH = '../build';
const CRX_NAME = 'chrome.crx';
const XPI_NAME = 'firefox.xpi';
const CHROME_UPDATER_FILENAME = 'update.xml';
const FIREFOX_UPDATER_FILENAME = 'update.json';
const MANIFEST_NAME = 'manifest.json';

// Chrome CRX certificate paths
const CERTIFICATE_PATHS = {
    beta: './private/AdguardBrowserAssistant/certificate-beta.pem',
    release: './private/AdguardBrowserAssistant/certificate-release.pem',
};

const { BUILD_ENV } = process.env;
const deployPath = BUILD_ENVS_MAP[BUILD_ENV].outputPath;

// Update manifest URL for the Chrome extension
const CHROME_UPDATE_URL = `https://static.adtidy.org/extensions/browserassistant/${deployPath}/${CHROME_UPDATER_FILENAME}`;

// Update manifest URL for the Firefox add-on
const FIREFOX_UPDATE_URL = `https://static.adtidy.org/extensions/browserassistant/${deployPath}/${FIREFOX_UPDATER_FILENAME}`;

// Path to the Chrome CRX (that we'll add to the update manifest)
const CHROME_UPDATE_CRX = `https://static.adtidy.org/extensions/browserassistant/${deployPath}/${CRX_NAME}`;

// Path to the Firefox XPI (that we'll add to the update manifest)
const FIREFOX_UPDATE_XPI = `https://static.adtidy.org/extensions/browserassistant/${deployPath}/${XPI_NAME}`;

module.exports = {
    LOCALES_PATH,
    BUILD_ENVS,
    BUILD_ENVS_MAP,
    SRC_PATH,
    BUILD_PATH,
    CERTIFICATE_PATHS,
    MANIFEST_NAME,
    BROWSER_TYPES,
    CHROME_UPDATE_URL,
    FIREFOX_UPDATE_URL,
    CHROME_UPDATE_CRX,
    FIREFOX_UPDATE_XPI,
    CHROME_UPDATER_FILENAME,
    FIREFOX_UPDATER_FILENAME,
    CRX_NAME,
    XPI_NAME,
};
