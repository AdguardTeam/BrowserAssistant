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

const LOAD_PATH = {
    beta: `${BUILD_PATH}/${ENV_MAP.beta.outputPath}/chrome`,
    release: `${BUILD_PATH}/${ENV_MAP.release.outputPath}/chrome`,
};

const WRITE_FILE_PATH = {
    beta: './build/beta',
    release: './build/release',
};

const CERTIFICATE_PATH = './private/AdguardBrowserAssistant/certificate.pem';

module.exports = {
    LOCALES_PATH,
    ENV_MAP,
    SRC_PATH,
    IS_DEV,
    BUILD_PATH,
    CERTIFICATE_PATH,
    LOAD_PATH,
    WRITE_FILE_PATH,
};
