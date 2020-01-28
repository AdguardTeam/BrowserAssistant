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

const CHROME_UPDATE_URL = 'https://adguardteam.github.io/BrowserAssistant/chrome_updates.xml';

module.exports = {
    LOCALES_PATH,
    ENV_MAP,
    SRC_PATH,
    IS_DEV,
    BUILD_PATH,
    CERTIFICATE_PATH,
    CHROME_UPDATE_URL,
    MANIFEST_NAME,
    BROWSER_TYPES,
};
