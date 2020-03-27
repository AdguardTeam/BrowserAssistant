const { ENV_MAP, IS_DEV } = require('./consts');
const pJson = require('../package');
const twoskyConfig = require('../.twosky.json');

const [{ base_locale: baseLocale }] = twoskyConfig;

const appendEnvSuffix = (name, env) => {
    const envData = ENV_MAP[env];
    if (!envData) {
        throw new Error(`Wrong environment: ${env}`);
    }
    return envData.name ? `${name} ${envData.name}` : name;
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

const getOutputPathByEnv = (env) => {
    const envData = ENV_MAP[env];
    if (!envData) {
        throw new Error(`Wrong environment: ${env}`);
    }
    return envData.outputPath;
};

module.exports = {
    appendEnvSuffix, updateManifest, getOutputPathByEnv,
};
