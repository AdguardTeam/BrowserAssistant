const path = require('path');

const SRC_PATH = '../src';
const LOCALES_PATH = path.join(__dirname, SRC_PATH, '_locales/en/messages');
const ENV_MAP = {
    dev: { outputPath: 'dev', name: 'Dev' },
    beta: { outputPath: 'beta', name: 'Beta' },
    release: { outputPath: 'release', name: '' },
};

const BROWSER_TYPES = { CHROME: 'chrome', FIREFOX: 'firefox', EDGE: 'edge' };

const IS_DEV = process.env.NODE_ENV === 'dev';

const BUILD_PATH = '../build';

const MANIFEST_NAME = 'manifest.json';

const CERTIFICATE_PATH = './private/AdguardBrowserAssistant/certificate.pem';

const CHROME_UPDATE_URL = 'https://static.adguard.com/browserassistant/beta/update.xml';

const FIREFOX_UPDATE_URL = 'https://static.adguard.com/browserassistant/beta/update.json';

const CHROME_UPDATE_CRX = 'https://static.adguard.com/browserassistant/beta/chrome.crx';

const FIREFOX_UPDATE_XML = 'https://static.adguard.com/browserassistant/beta/firefox.xpi';

const CHROME_UPDATER_FILENAME = 'update.xml';

const FIREFOX_UPDATER_FILENAME = 'update.json';

module.exports = {
    LOCALES_PATH,
    ENV_MAP,
    SRC_PATH,
    IS_DEV,
    BUILD_PATH,
    CERTIFICATE_PATH,
    MANIFEST_NAME,
    BROWSER_TYPES,
    CHROME_UPDATE_URL,
    FIREFOX_UPDATE_URL,
    CHROME_UPDATE_CRX,
    FIREFOX_UPDATE_XML,
    CHROME_UPDATER_FILENAME,
    FIREFOX_UPDATER_FILENAME,
};
