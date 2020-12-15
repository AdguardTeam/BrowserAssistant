const merge = require('webpack-merge');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin');
const common = require('./webpack.common');
const { updateManifest } = require('./helpers');

const { BROWSER } = process.env;

const outputPath = BROWSER;
// eslint-disable-next-line import/no-dynamic-require
const manifestDiff = require(`./manifest.${BROWSER}`);

const plugins = [
    new CopyWebpackPlugin([
        {
            from: path.resolve(__dirname, './manifest.common.json'),
            to: 'manifest.json',
            // eslint-disable-next-line no-unused-vars
            transform: (content, path) => updateManifest(content, manifestDiff),
        },
    ]),
];

const BUILD_ENVS = {
    DEV: 'dev',
    BETA: 'beta',
    RELEASE: 'release',
};

const { BUILD_ENV } = process.env;
if (BUILD_ENV === BUILD_ENVS.BETA || BUILD_ENV === BUILD_ENVS.RELEASE) {
    plugins.push(
        new ZipWebpackPlugin({
            path: '../',
            filename: `${BROWSER}.zip`,
        })
    );
}

const configDiff = {
    output: {
        path: path.join(common.output.path, outputPath),
    },
    plugins,
};

module.exports = merge(common, configDiff);
