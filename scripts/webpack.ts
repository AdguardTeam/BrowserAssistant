const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin');
const webpack = require('webpack');
import { Configuration, WebpackPluginInstance } from 'webpack';

import {
    SRC_PATH,
    BUILD_PATH,
    CHROME_UPDATE_CRX,
    FIREFOX_UPDATE_XPI,
    Browser,
    BUILD_ENV,
    BuildEnv,
} from './consts';
import { getOutputPathByBuildEnv, appendBuildEnvSuffix, updateManifest } from './helpers';

const BACKGROUND_PATH = path.resolve(__dirname, SRC_PATH, 'background');
const POPUP_PATH = path.resolve(__dirname, SRC_PATH, 'popup');
const CONTENT_SCRIPTS_PATH = path.resolve(__dirname, SRC_PATH, 'content-scripts');
const POST_INSTALL_PATH = path.resolve(__dirname, SRC_PATH, 'post-install');
const OPTIONS_UI_PATH = path.resolve(__dirname, SRC_PATH, 'options-ui');

export const getWebpackConfig = (
    browser: Browser = Browser.Chrome,
    isWatchMode: boolean = false,
): Configuration => {
    const IS_DEV = BUILD_ENV === BuildEnv.Dev;
    const OUTPUT_PATH = getOutputPathByBuildEnv(BUILD_ENV);
    const cleanOptions = IS_DEV ? { cleanAfterEveryBuildPatterns: ['!**/*.json', '!assets/**/*'] } : {};

    const plugins: WebpackPluginInstance[] = [
        new CleanWebpackPlugin(cleanOptions),
        new CopyWebpackPlugin({ patterns: [
            {
                context: 'src',
                from: 'assets/',
                to: 'assets/',
            },
            {
                context: 'src',
                from: '_locales/',
                to: '_locales/',
                // Add build environment suffixes to the extension name in locale files
                transform: (content: Buffer, path: string) => {
                    // ignore all paths except messages.json
                    if (path.indexOf('messages.json') === -1) {
                        return content;
                    }
                    const messages = JSON.parse(content.toString());
                    if (messages && messages.name) {
                        messages.name.message = appendBuildEnvSuffix(messages.name.message, BUILD_ENV);
                    }
                    return Buffer.from(JSON.stringify(messages, null, 4));
                },
            },
            {
                from: path.resolve(__dirname, './manifest.common.json'),
                to: 'manifest.json',
                transform: (content: Buffer) => {
                    // eslint-disable-next-line import/no-dynamic-require,global-require
                    const manifestDiff = require(`./manifest.${browser}`);
                    return updateManifest(content.toString(), manifestDiff);
                },
            },
        ] }),
        new webpack.NormalModuleReplacementPlugin(
            /\.\/ConsentAbstract/,
            ((resource: { contextInfo: { issuer: string | string[]; }; request: string; }) => {
                if (!resource.contextInfo.issuer.includes('background/consent/index.js')) {
                    return;
                }
                if (browser === Browser.Firefox) {
                // eslint-disable-next-line no-param-reassign
                    resource.request = resource.request.replace(/\.\/ConsentAbstract/, './ConsentFirefox');
                } else if (browser === Browser.Chrome
                || browser === Browser.Edge) {
                // eslint-disable-next-line no-param-reassign
                    resource.request = resource.request.replace(/\.\/ConsentAbstract/, './ConsentChrome');
                } else {
                    throw new Error(`There is no proxy api for browser: ${browser}`);
                }
            })),
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
        new HtmlWebpackPlugin({
            template: path.join(POST_INSTALL_PATH, 'index.html'),
            filename: 'post-install.html',
            chunks: ['post-install'],
        }),
        new HtmlWebpackPlugin({
            template: path.join(OPTIONS_UI_PATH, 'index.html'),
            filename: 'options-ui.html',
            chunks: ['options-ui'],
        }),
    ];

    if (browser === Browser.Firefox) {
        plugins.push(new HtmlWebpackPlugin({
            template: path.join(BACKGROUND_PATH, 'index.html'),
            filename: 'background.html',
            chunks: ['background'],
        }));
    }

    // If watch mode we don't need to generate zip
    if (!isWatchMode) {
        plugins.push(
            new ZipWebpackPlugin({
                path: '../',
                filename: `${browser}.zip`,
            }),
        );
    }

    return {
        mode: IS_DEV ? 'development' : 'production',
        devtool: IS_DEV ? 'eval-source-map' : false,
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
            'post-install': POST_INSTALL_PATH,
            'options-ui': OPTIONS_UI_PATH,
        },
        output: {
            path: path.resolve(__dirname, BUILD_PATH, OUTPUT_PATH, browser),
            filename: '[name].js',
        },
        resolve: {
            extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
        },
        module: {
            rules: [
                {
                    test: /\.(js|ts)$/,
                    loader: 'string-replace-loader',
                    options: {
                        multiple: [
                            { search: '{{UPDATE_URL_FIREFOX}}', replace: FIREFOX_UPDATE_XPI },
                            { search: '{{UPDATE_URL_CHROME}}', replace: CHROME_UPDATE_CRX },
                        ],
                    },
                },
                {
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: { babelrc: true, compact: false },
                },
                {
                    test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
                    exclude: /node_modules/,
                    loader: 'url-loader',
                    options: {
                        limit: 100000,
                    },
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
        plugins,
    };
};
