import chalk from 'chalk';

export const SRC_PATH = '../src';

export const enum BuildEnv {
    Dev = 'dev',
    Beta = 'beta',
    Release = 'release',
}

export const BUILD_ENVS_MAP = {
    [BuildEnv.Dev]: {
        outputPath: 'dev',
        name: 'Dev',
    },
    [BuildEnv.Beta]: {
        outputPath: 'beta',
        name: 'Beta',
    },
    [BuildEnv.Release]: {
        outputPath: 'release',
        name: '',
    },
};

// Build output path
export const BUILD_PATH = '../build';
export const CRX_NAME = 'chrome.crx';
export const XPI_NAME = 'firefox.xpi';
export const CHROME_UPDATER_FILENAME = 'update.xml';
export const FIREFOX_UPDATER_FILENAME = 'update.json';
export const MANIFEST_NAME = 'manifest.json';

// Chrome CRX certificate paths
export const CERTIFICATE_PATHS = {
    [BuildEnv.Beta]: './private/AdguardBrowserAssistant/certificate-beta.pem',
    [BuildEnv.Release]: './private/AdguardBrowserAssistant/certificate-release.pem',
};

/**
 * Validates BUILD_ENV value
 * @param buildEnv
 */
const getBuildEnv = (buildEnv: unknown): BuildEnv => {
    switch (buildEnv) {
        case BuildEnv.Beta:
            return BuildEnv.Beta;
        case BuildEnv.Release:
            return BuildEnv.Release;
        case BuildEnv.Dev:
            return BuildEnv.Dev;
        default:
            console.log(chalk.yellowBright(`\nBUILD_ENV is not set, defaulting to ${BuildEnv.Dev}`));
            return BuildEnv.Dev;
    }
};

export const BUILD_ENV = getBuildEnv(process.env.BUILD_ENV);

export const enum Browser {
    Chrome = 'chrome',
    Firefox = 'firefox',
    Edge = 'edge',
}

const deployPath = BUILD_ENVS_MAP[BUILD_ENV].outputPath;

// Update manifest URL for the Chrome extension
export const CHROME_UPDATE_URL = `https://static.adtidy.org/extensions/browserassistant/${deployPath}/${CHROME_UPDATER_FILENAME}`;

// Update manifest URL for the Firefox add-on
export const FIREFOX_UPDATE_URL = `https://static.adtidy.org/extensions/browserassistant/${deployPath}/${FIREFOX_UPDATER_FILENAME}`;

// Path to the Chrome CRX (that we'll add to the update manifest)
export const CHROME_UPDATE_CRX = `https://static.adtidy.org/extensions/browserassistant/${deployPath}/${CRX_NAME}`;

// Path to the Firefox XPI (that we'll add to the update manifest)
export const FIREFOX_UPDATE_XPI = `https://static.adtidy.org/extensions/browserassistant/${deployPath}/${XPI_NAME}`;
