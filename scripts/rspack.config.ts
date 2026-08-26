/**
 * @file Rspack configuration for the extension builds.
 */
import fs from 'fs';
import path from 'path';

import { rspack } from '@rspack/core';
import type {
    Compiler,
    Configuration,
    RspackPluginInstance,
} from '@rspack/core';

import { MIN_SUPPORTED_VERSION } from '../constants';

import {
    SRC_PATH,
    BUILD_PATH,
    CHROME_UPDATE_CRX,
    FIREFOX_UPDATE_XPI,
    Browser,
    BUILD_ENV,
    BuildEnv,
} from './consts';
import {
    getOutputPathByBuildEnv,
    appendBuildEnvSuffix,
    updateManifest,
} from './helpers';

const HtmlRspackPlugin = rspack.HtmlRspackPlugin;
const CopyRspackPlugin = rspack.CopyRspackPlugin;

const BACKGROUND_PATH = path.resolve(__dirname, SRC_PATH, 'background');
const POPUP_PATH = path.resolve(__dirname, SRC_PATH, 'popup');
const CONTENT_SCRIPTS_PATH = path.resolve(__dirname, SRC_PATH, 'content-scripts');
const POST_INSTALL_PATH = path.resolve(__dirname, SRC_PATH, 'post-install');
const OPTIONS_UI_PATH = path.resolve(__dirname, SRC_PATH, 'options-ui');

/**
 * Preserves copied locale JSON and static assets when the output
 * directory is cleaned in dev mode, replicating the webpack
 * CleanWebpackPlugin dev exceptions (its cleanAfterEveryBuildPatterns
 * negated all '*.json' files and everything under 'assets/').
 * Matches both absolute and output-relative paths.
 * @param filePath File path to check.
 * @returns Whether the file should be kept on dev clean.
 */
const keepOnDevClean = (filePath: string): boolean => (
    filePath.endsWith('.json') || /(^|[\\/])assets[\\/]/.test(filePath)
);

/**
 * Deletes files the current compilation did not emit, running after
 * every build — including watch rebuilds, where output.clean does not
 * re-apply. Replicates the webpack CleanWebpackPlugin
 * cleanAfterEveryBuild behavior; copied locale JSON and static assets
 * are preserved via keepOnDevClean.
 */
class CleanStaleDevFilesPlugin {
    /**
     * Registers the afterEmit hook that removes stale files from the output.
     * @param compiler Webpack compiler instance.
     */
    apply(compiler: Compiler): void {
        compiler.hooks.afterEmit.tap('CleanStaleDevFilesPlugin', (compilation) => {
            const outputPath = compilation.outputOptions.path as string;
            const emittedFiles = new Set(
                Object.keys(compilation.assets).map((name) => name.split('/').join(path.sep)),
            );
            const removeStaleFiles = (dir: string): void => {
                fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
                    const fullPath = path.join(dir, entry.name);
                    if (entry.isDirectory()) {
                        removeStaleFiles(fullPath);
                        return;
                    }
                    const relativePath = path.relative(outputPath, fullPath);
                    if (!emittedFiles.has(relativePath) && !keepOnDevClean(relativePath)) {
                        fs.unlinkSync(fullPath);
                    }
                });
            };
            if (fs.existsSync(outputPath)) {
                removeStaleFiles(outputPath);
            }
        });
    }
}

export const getRspackConfig = (
    browser: Browser = Browser.Chrome,
    isWatchMode: boolean = false,
): Configuration => {
    const IS_DEV = BUILD_ENV === BuildEnv.Dev;
    const OUTPUT_PATH = getOutputPathByBuildEnv(BUILD_ENV);

    const plugins: RspackPluginInstance[] = [
        new CopyRspackPlugin({
            patterns: [
                {
                    context: 'src',
                    from: 'assets/',
                    to: 'assets/',
                },
                {
                    context: 'src',
                    from: '_locales/',
                    to: '_locales/',
                    transform: (content: Buffer, filePath: string) => {
                        if (filePath.indexOf('messages.json') === -1) {
                            return content;
                        }
                        const messages = JSON.parse(content.toString());
                        if (messages?.name) {
                            messages.name.message = appendBuildEnvSuffix(
                                messages.name.message,
                                BUILD_ENV,
                            );
                        }
                        return Buffer.from(JSON.stringify(messages, null, 4));
                    },
                },
                {
                    from: path.resolve(__dirname, './manifest.common.json'),
                    to: 'manifest.json',
                    transform: (content: Buffer) => {
                        // eslint-disable-next-line import/no-dynamic-require, global-require
                        const manifestDiff = require(`./manifest.${browser}`);
                        return updateManifest(content.toString(), manifestDiff, browser);
                    },
                },
            ],
        }),
        new rspack.NormalModuleReplacementPlugin(
            /\.\/ConsentAbstract/,
            ((resource: { contextInfo: { issuer: string }; request: string }) => {
                // The issuer path ends with the consent index module's
                // source extension (.ts since the TS conversion); match
                // extension-agnostically so the substitution keeps working.
                if (!resource.contextInfo.issuer.includes('background/consent/index.')) {
                    return;
                }
                if (browser === Browser.Firefox) {
                    // eslint-disable-next-line no-param-reassign
                    resource.request = resource.request.replace(
                        /\.\/ConsentAbstract/,
                        './ConsentFirefox',
                    );
                } else if (browser === Browser.Chrome || browser === Browser.Edge) {
                    // eslint-disable-next-line no-param-reassign
                    resource.request = resource.request.replace(
                        /\.\/ConsentAbstract/,
                        './ConsentChrome',
                    );
                } else {
                    throw new Error(`There is no proxy api for browser: ${browser}`);
                }
            }) as any,
        ),
        new HtmlRspackPlugin({
            template: path.join(POPUP_PATH, 'index.html'),
            filename: 'popup.html',
            chunks: ['popup'],
        }),
        new HtmlRspackPlugin({
            template: path.join(POST_INSTALL_PATH, 'index.html'),
            filename: 'post-install.html',
            chunks: ['post-install'],
        }),
        new HtmlRspackPlugin({
            template: path.join(OPTIONS_UI_PATH, 'index.html'),
            filename: 'options-ui.html',
            chunks: ['options-ui'],
        }),
    ];

    // Firefox needs a background page; Chrome and Edge use service worker
    if (browser === Browser.Firefox) {
        plugins.push(new HtmlRspackPlugin({
            template: path.join(BACKGROUND_PATH, 'index.html'),
            filename: 'background.html',
            chunks: ['background'],
        }));
    }

    // Dev builds remove stale emitted files after every build — watch
    // rebuilds included — while preserving copied locales and assets.
    if (IS_DEV) {
        plugins.push(new CleanStaleDevFilesPlugin());
    }

    return {
        mode: IS_DEV ? 'development' : 'production',
        devtool: IS_DEV ? 'inline-source-map' : false,
        performance: {
            hints: false,
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
            // Dev builds clean stale emitted files but preserve copied
            // locale JSON and static assets across rebuilds, replicating
            // the webpack dev clean exceptions. One-shot beta/release
            // builds clean fully; watch builds never clean to avoid
            // wiping output on rebuild.
            clean: IS_DEV ? { keep: keepOnDevClean } : !isWatchMode,
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        module: {
            rules: [
                {
                    // Replace {{UPDATE_URL_*}} placeholders in source files
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
                    // SWC transpilation for the TypeScript sources
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    loader: 'builtin:swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'typescript',
                                tsx: true,
                            },
                            transform: {
                                react: {
                                    runtime: 'classic',
                                },
                            },
                            // Loose mode for class properties, matching
                            // the pre-rspack build's transpiler config.
                            loose: true,
                        },
                        env: {
                            targets: {
                                chrome: String(MIN_SUPPORTED_VERSION.CHROMIUM),
                                edge: String(MIN_SUPPORTED_VERSION.CHROMIUM),
                                firefox: String(MIN_SUPPORTED_VERSION.FIREFOX),
                                opera: String(MIN_SUPPORTED_VERSION.OPERA),
                            },
                        },
                    },
                },
                {
                    // Asset inlining: inline as data URL if below 100 KB,
                    // otherwise emit as separate file. Matches url-loader
                    // limit of 100000 bytes.
                    test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 100 * 1024, // 100 KB
                        },
                    },
                },
                {
                    // PostCSS pipeline for .css and .pcss files
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
