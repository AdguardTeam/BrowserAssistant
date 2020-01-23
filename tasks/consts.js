const path = require('path');

const SRC_PATH = '../src';
const LOCALES_PATH = path.join(__dirname, SRC_PATH, '_locales/en/messages');
const NODE_ENVS = { DEV: 'dev', BETA: 'beta', RELEASE: 'release' };
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

const UPDATE_URL = 'TODO';

module.exports = {
    LOCALES_PATH,
    ENV_MAP,
    SRC_PATH,
    IS_DEV,
    BUILD_PATH,
    CERTIFICATE_PATH,
    UPDATE_URL,
    MANIFEST_NAME,
    NODE_ENVS,
    BROWSER_TYPES,
};
