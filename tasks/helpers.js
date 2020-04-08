const { CHANNEL_MAP, IS_DEV } = require('./consts');
const pJson = require('../package');
const twoskyConfig = require('../.twosky.json');

const [{ base_locale: baseLocale }] = twoskyConfig;

const appendChannelSuffix = (name, channel) => {
    const channelData = CHANNEL_MAP[channel];
    if (!channelData) {
        throw new Error(`Wrong channel: ${channel}`);
    }
    return channelData.name ? `${name} ${channelData.name}` : name;
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

const getOutputPathByChannel = (channel) => {
    const channelData = CHANNEL_MAP[channel];
    if (!channelData) {
        throw new Error(`Wrong channel: ${channel}`);
    }
    return channelData.outputPath;
};

module.exports = {
    appendChannelSuffix, updateManifest, getOutputPathByChannel,
};
