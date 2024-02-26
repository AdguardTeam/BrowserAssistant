/* eslint-disable no-console */

import path from 'path';
import { promises as fs } from 'fs';

import { Manifest } from 'webextension-polyfill';
import chalk from 'chalk';

import { getErrorMessage } from '../src/lib/errors';
import config from '../package.json';

import {
    BUILD_PATH,
    BUILD_ENVS_MAP,
    FIREFOX_UPDATER_FILENAME,
    FIREFOX_UPDATE_XPI,
    MANIFEST_NAME,
    BUILD_ENV,
    Browser,
} from './consts';

import WebExtensionManifest = Manifest.WebExtensionManifest;

const { outputPath } = BUILD_ENVS_MAP[BUILD_ENV];
const BUILD = 'build';

const buildDir = path.resolve(BUILD, BUILD_ENVS_MAP[BUILD_ENV].outputPath);
const fileDir = path.resolve(buildDir, FIREFOX_UPDATER_FILENAME);

const getFirefoxManifest = async (): Promise<WebExtensionManifest> => {
    const MANIFEST_PATH = path.resolve(
        __dirname, BUILD_PATH, outputPath, Browser.Firefox, MANIFEST_NAME,
    );
    const manifestBuffer = await fs.readFile(MANIFEST_PATH);
    const manifest = JSON.parse(manifestBuffer.toString());
    return manifest;
};

type GenerateUpdateJsonProps = {
    id: string;
    version: string;
    updateLink: string;
    strictMinVersion: string;
};

type UpdateJson = {
    addons: {
        [id: string]: {
            updates: [
                {
                    version: string;
                    update_link: string;
                    browser_specific_settings: {
                        gecko: {
                            strict_min_version: string;
                        }
                    }
                },
            ]
        }
    }
};

const generateUpdateJson = ({
    id,
    version,
    updateLink,
    strictMinVersion,
}: GenerateUpdateJsonProps): UpdateJson => {
    return ({
        addons: {
            [id]: {
                updates: [
                    {
                        version,
                        update_link: updateLink,
                        browser_specific_settings: {
                            gecko: {
                                strict_min_version: strictMinVersion,
                            },
                        },
                    },
                ],
            },
        },
    });
};

const createUpdateJson = async (manifest: WebExtensionManifest) => {
    if (!manifest?.browser_specific_settings?.gecko) {
        throw new Error('Manifest is missing gecko section');
    }

    const { id, strict_min_version: strictMinVersion } = manifest.browser_specific_settings.gecko;
    if (!id || !strictMinVersion) {
        throw new Error('Manifest is missing id or strict_min_version');
    }

    try {
        const fileContent = generateUpdateJson({
            id,
            version: config.version,
            updateLink: FIREFOX_UPDATE_XPI,
            strictMinVersion,
        });

        const fileJson = JSON.stringify(fileContent, null, 4);

        await fs.writeFile(fileDir, fileJson);
        console.log(chalk.greenBright(`${FIREFOX_UPDATER_FILENAME} saved in ${buildDir}\n`));
    } catch (error: unknown) {
        // eslint-disable-next-line max-len
        console.error(chalk.redBright(`Error: cannot create ${FIREFOX_UPDATER_FILENAME} - ${getErrorMessage(error)}\n`));
        throw error;
    }
};

const updateJson = async () => {
    try {
        const manifest = await getFirefoxManifest();
        await createUpdateJson(manifest);
    } catch (error: unknown) {
        console.error(chalk.redBright(getErrorMessage(error)));
        console.error(error);
        // Fail the task execution
        process.exit(1);
    }
};

updateJson();
