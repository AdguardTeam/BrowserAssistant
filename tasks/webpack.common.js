const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const {
    SRC_PATH,
    BUILD_PATH,
    CHROME_UPDATE_CRX,
    FIREFOX_UPDATE_XPI,
} = require('./consts');
const { getOutputPathByEnv, appendEnvSuffix } = require('./helpers');

const BACKGROUND_PATH = path.resolve(__dirname, SRC_PATH, 'background');
const POPUP_PATH = path.resolve(__dirname, SRC_PATH, 'popup');
const CONTENT_SCRIPTS_PATH = path.resolve(__dirname, SRC_PATH, 'content-scripts');

const IS_DEV = process.env.NODE_ENV === 'dev';

const OUTPUT_PATH = getOutputPathByEnv(process.env.NODE_ENV);

const cleanOptions = IS_DEV ? { cleanAfterEveryBuildPatterns: ['!**/*.json', '!assets/**/*'] } : {};

const config = {
    mode: IS_DEV ? 'development' : 'production',
    devtool: IS_DEV ? 'cheap-module-eval-source-map' : false,
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
    optimization: {
        minimize: false,
    },
    entry: {
        background: BACKGROUND_PATH,
        popup: POPUP_PATH,
        'content-scripts': CONTENT_SCRIPTS_PATH,
    },
    output: {
        path: path.resolve(__dirname, BUILD_PATH, OUTPUT_PATH),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'string-replace-loader',
                options: {
                    multiple: [
                        { search: '{{UPDATE_URL_FIREFOX}}', replace: FIREFOX_UPDATE_XPI },
                        { search: '{{UPDATE_URL_CHROME}}', replace: CHROME_UPDATE_CRX },
                    ],
                },
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: { babelrc: true, compact: false },
            },
            {
                test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=100000',
            },
            {
                test: /\.(css|pcss)$/,
                exclude: /node_modules/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader',
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(cleanOptions),
        new CopyWebpackPlugin([
            {
                context: 'src',
                from: 'assets/',
                to: 'assets/',
            },
            {
                context: 'src',
                from: '_locales/',
                to: '_locales/',
                // Add env suffixes to the extension name in locale files
                transform: (content, path) => {
                    // ignore all paths except messages.json
                    if (path.indexOf('messages.json') === -1) {
                        return content;
                    }
                    const messages = JSON.parse(content.toString());
                    if (messages && messages.name) {
                        // eslint-disable-next-line max-len
                        messages.name.message = appendEnvSuffix(messages.name.message, process.env.NODE_ENV);
                    }
                    return Buffer.from(JSON.stringify(messages, null, 4));
                },
            },
        ]),
        new HtmlWebpackPlugin({
            template: path.join(BACKGROUND_PATH, 'index.html'),
            filename: 'background.html',
            chunks: ['background'],
        }),
        new HtmlWebpackPlugin({
            template: path.join(POPUP_PATH, 'index.html'),
            filename: 'popup.html',
            chunks: ['popup'],
        }),
    ],
};

module.exports = config;
