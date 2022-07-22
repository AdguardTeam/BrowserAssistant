const { BUILD_ENVS, BUILD_ENVS_MAP } = require('./consts');
const pJson = require('../package.json');
const twoskyConfig = require('../.twosky.json');

const { BUILD_ENV } = process.env;
// TODO remove the rule bellow
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const IS_DEV = BUILD_ENV === BUILD_ENVS.DEV;

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
    // TODO handle content security policy for dev builds in mv3
    // const devPolicy = IS_DEV ? { content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'" } : {};

    const updatedManifest = {
        ...manifest,
        ...browserManifestDiff,
        // TODO fix
        // ...devPolicy,
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
