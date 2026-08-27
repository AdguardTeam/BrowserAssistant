/**
 * @file Shared helpers and the manifest type of the build scripts.
 */
import {
    Browser,
    BUILD_ENV,
    BUILD_ENVS_MAP,
    BuildEnv,
} from './consts';

const pJson = require('../package.json');
const twoskyConfig = require('../.twosky.json');

export type Manifest = chrome.runtime.ManifestV2 | chrome.runtime.ManifestV3;

const [{ base_locale: baseLocale }] = twoskyConfig;

export const getEnvConf = (env: BuildEnv) => {
    const envConfig = BUILD_ENVS_MAP[env];
    if (!envConfig) {
        throw new Error(`No env config for: "${env}"`);
    }
    return envConfig;
};

export const appendBuildEnvSuffix = (name: string, buildEnv: BuildEnv) => {
    const buildEnvData = getEnvConf(buildEnv);
    return buildEnvData.name ? `${name} ${buildEnvData.name}` : name;
};

/**
 * Store-compatible version: CWS / AMO listed / Edge reject `-beta.N`.
 * `1.2.0-beta.1` → `1.2.0`.
 * @param version Version from package.json or CHANGELOG.
 * @returns Numeric core without a pre-release suffix.
 */
export const toStoreVersion = (version: string): string => String(version).split('-')[0];

/**
 * Chrome/Edge beta version: stores reject `-beta.N`, but stripping it
 * entirely collides successive betas (CWS duplicate version) and stops
 * `update.xml` from offering beta.2 to beta.1. The manifest version scheme
 * allows a fourth numeric component, so `1.2.0-beta.1` → `1.2.0.1` and the
 * eventual `1.2.0` release still supersedes the betas.
 * @param version Version from package.json or CHANGELOG.
 * @returns Store-compatible numeric beta, or the store version otherwise.
 */
export const toChromeBetaVersion = (version: string): string => {
    const match = String(version).match(/^(\d+\.\d+\.\d+)-beta\.(\d+)$/);
    if (!match) {
        return toStoreVersion(version);
    }
    return `${match[1]}.${match[2]}`;
};

/**
 * Firefox toolkit version for self-hosted beta XPIs.
 * `1.2.0-beta.1` → `1.2.0beta1`, which sorts beta.1 < beta.2 < 1.2.0 so
 * `update.json` can offer successive betas and the eventual release still
 * supersedes them. Chrome/CWS cannot use this form.
 * @param version Version from package.json or CHANGELOG.
 * @returns Toolkit version for Firefox beta, or the store version otherwise.
 */
export const toFirefoxBetaVersion = (version: string): string => {
    const match = String(version).match(/^(\d+\.\d+\.\d+)-beta\.(\d+)$/);
    if (!match) {
        return toStoreVersion(version);
    }
    return `${match[1]}beta${match[2]}`;
};

export const updateManifest = (
    manifestJson: string,
    browserManifestDiff?: Partial<Manifest>,
    browser: Browser = Browser.Chrome,
) => {
    const manifest: Manifest = JSON.parse(manifestJson);
    const rawVersion = String(pJson.version);
    let version = toStoreVersion(rawVersion);
    if (BUILD_ENV === BuildEnv.Beta) {
        version = browser === Browser.Firefox
            ? toFirefoxBetaVersion(rawVersion)
            : toChromeBetaVersion(rawVersion);
    }

    const updatedManifest = {
        ...manifest,
        ...browserManifestDiff,
        default_locale: baseLocale,
        version,
    };

    return Buffer.from(JSON.stringify(updatedManifest, null, 4));
};

export const getOutputPathByBuildEnv = (buildEnv: BuildEnv) => {
    const buildEnvData = getEnvConf(buildEnv);
    return buildEnvData.outputPath;
};
