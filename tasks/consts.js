const path = require('path');

const SRC_PATH = '../src';
const LOCALES_PATH = path.join(__dirname, SRC_PATH, '_locales/en/messages');
const ENV_MAP = {
    dev: { outputPath: 'dev', name: 'Dev' },
    beta: { outputPath: 'beta', name: 'Beta' },
    release: { outputPath: 'release', name: '' },
};

const IS_DEV = process.env.NODE_ENV === 'dev';

const BUILD_PATH = '../build';

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
};
