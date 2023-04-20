import { BUILD_ENVS_MAP, BUILD_ENV, BuildEnv } from './consts';
const pJson = require('../package.json');
const twoskyConfig = require('../.twosky.json');

export type Manifest = chrome.runtime.ManifestV2 | chrome.runtime.ManifestV3;

const IS_DEV = BUILD_ENV === BuildEnv.Dev;

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
    const devPolicy = IS_DEV ? { content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'" } : {};

    const updatedManifest = {
        ...manifest,
        ...browserManifestDiff,
        ...devPolicy,
        default_locale: baseLocale,
        version: pJson.version,
    };

    return Buffer.from(JSON.stringify(updatedManifest, null, 4));
};

export const getOutputPathByBuildEnv = (buildEnv: BuildEnv) => {
    const buildEnvData = getEnvConf(buildEnv);
    return buildEnvData.outputPath;
};
