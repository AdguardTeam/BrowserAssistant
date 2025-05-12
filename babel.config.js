const { MIN_SUPPORTED_VERSION } = require('./constants');

module.exports = (api) => {
    api.cache(false);
    return {
        presets: [
            ['@babel/preset-env', {
                targets: {
                    chrome: String(MIN_SUPPORTED_VERSION.CHROMIUM),
                    edge: String(MIN_SUPPORTED_VERSION.CHROMIUM),
                    firefox: String(MIN_SUPPORTED_VERSION.FIREFOX),
                    opera: String(MIN_SUPPORTED_VERSION.OPERA),
                },
            }],
            '@babel/preset-react',
            '@babel/preset-typescript'],
        plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            ['@babel/plugin-transform-private-methods', { loose: true }],
            ['@babel/plugin-transform-private-property-in-object', { loose: true }],
            ['@babel/plugin-transform-runtime', {
                helpers: true,
                regenerator: true,
            }],
            '@babel/plugin-proposal-export-namespace-from',
            '@babel/plugin-proposal-export-default-from',
        ],
    };
};
