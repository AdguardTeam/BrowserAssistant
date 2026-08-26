/**
 * @file Shared helpers and the manifest type of the build scripts.
 */
import { BUILD_ENVS_MAP, BuildEnv } from './consts';

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

export const updateManifest = (manifestJson: string, browserManifestDiff?: Partial<Manifest>) => {
    const manifest: Manifest = JSON.parse(manifestJson);

    const updatedManifest = {
        ...manifest,
        ...browserManifestDiff,
        default_locale: baseLocale,
        // Stores reject pre-release suffixes (`-beta.N`, `-dev`). Extra strips
        // these in its manifest helper; keep the numeric core here.
        version: String(pJson.version).split('-')[0],
    };

    return Buffer.from(JSON.stringify(updatedManifest, null, 4));
};

export const getOutputPathByBuildEnv = (buildEnv: BuildEnv) => {
    const buildEnvData = getEnvConf(buildEnv);
    return buildEnvData.outputPath;
};
