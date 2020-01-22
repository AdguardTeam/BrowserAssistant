const merge = require('webpack-merge');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin');
const common = require('../webpack.common');
const { updateManifest } = require('../helpers');
const chromeManifestDiff = require('./manifest.chrome');
const pJson = require('../../package.json');

const CHROME_PATH = 'chrome';

const plugins = [
    new CopyWebpackPlugin([
        {
            from: path.resolve(__dirname, '../manifest.common.json'),
            to: 'manifest.json',
            // eslint-disable-next-line no-unused-vars
            transform: (content, path) => updateManifest(content, chromeManifestDiff),
        },
    ]),
];

if (process.env.NODE_ENV === 'beta' || process.env.NODE_ENV === 'release') {
    plugins.push(
        new ZipWebpackPlugin({
            path: '../',
            filename: `chrome-${process.env.NODE_ENV}-${pJson.version}.zip`,
        })
    );
}

const chromeConfig = {
    output: {
        path: path.join(common.output.path, CHROME_PATH),
    },
    plugins,
};

module.exports = merge(common, chromeConfig);
