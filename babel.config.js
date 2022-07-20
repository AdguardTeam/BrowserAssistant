module.exports = (api) => {
    api.cache(false);
    return {
        presets: [
            ['@babel/preset-env', {
                targets: {
                    chrome: '55',
                    edge: '79',
                    firefox: '54',
                    opera: '42',
                },
            }],
            '@babel/preset-react',
            '@babel/preset-typescript'],
        plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            '@babel/plugin-transform-runtime',
            '@babel/plugin-proposal-export-namespace-from',
            '@babel/plugin-proposal-export-default-from',
        ],
    };
};
