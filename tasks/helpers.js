const { BUILD_ENVS_MAP, IS_DEV } = require('./consts');
const pJson = require('../package');
const twoskyConfig = require('../.twosky.json');

const [{ base_locale: baseLocale }] = twoskyConfig;

const appendBuildEnvSuffix = (name, buildEnv) => {
    const buildEnvData = BUILD_ENVS_MAP[buildEnv];
    if (!buildEnvData) {
        throw new Error(`Wrong build environment: ${buildEnv}`);
    }
    return buildEnvData.name ? `${name} ${buildEnvData.name}` : name;
};

const updateManifest = (manifestJson, browserManifestDiff) => {
    let manifest;
    try {
        manifest = JSON.parse(manifestJson.toString());
    } catch (e) {
        throw new Error('unable to parse json from manifest');
    }
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

const getOutputPathByBuildEnv = (buildEnv) => {
    const buildEnvData = BUILD_ENVS_MAP[buildEnv];
    if (!buildEnvData) {
        throw new Error(`Wrong build environment: ${buildEnv}`);
    }
    return buildEnvData.outputPath;
};

module.exports = {
    appendBuildEnvSuffix,
    updateManifest,
    getOutputPathByBuildEnv,
};
