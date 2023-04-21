/* eslint-disable no-console */

import { Manifest } from 'webextension-polyfill';

const webExt = require('web-ext');
const path = require('path');
const fs = require('fs').promises;
const chalk = require('chalk');

import {
    BUILD_PATH,
    BUILD_ENVS_MAP,
    FIREFOX_UPDATER_FILENAME,
    FIREFOX_UPDATE_URL,
    FIREFOX_UPDATE_XPI,
    MANIFEST_NAME,
    XPI_NAME,
    BUILD_ENV,
    Browser,
    BuildEnv,
} from './consts';
import WebExtensionManifest = Manifest.WebExtensionManifest;
import { getErrorMessage } from '../src/lib/errors';

const config = require('../package.json');

const { outputPath } = BUILD_ENVS_MAP[BUILD_ENV];
const BUILD = 'build';

const buildDir = path.resolve(BUILD, BUILD_ENVS_MAP[BUILD_ENV].outputPath);
const fileDir = path.resolve(buildDir, FIREFOX_UPDATER_FILENAME);

const getFirefoxManifest = async () => {
    const MANIFEST_PATH = path.resolve(
        __dirname, BUILD_PATH, outputPath, Browser.Firefox, MANIFEST_NAME,
    );
    const manifestBuffer = await fs.readFile(MANIFEST_PATH);
    const manifest = JSON.parse(manifestBuffer.toString());
    return manifest;
};

async function generateXpi() {
    const sourceDir = path.resolve(BUILD, BUILD_ENVS_MAP[BUILD_ENV].outputPath, Browser.Firefox);

    const credentialsPath = path.resolve(__dirname, '../private/AdguardBrowserAssistant/mozilla_credentials.json');

    // require called here in order to escape errors, until this module is really necessary
    // eslint-disable-next-line import/extensions
    const cryptor = require('../private/cryptor/dist');
    const credentialsContent = await cryptor(process.env.CREDENTIALS_PASSWORD)
        .getDecryptedContent(credentialsPath);
    const { apiKey, apiSecret } = JSON.parse(credentialsContent);

    const { downloadedFiles } = await webExt.default.cmd.sign({
        apiKey,
        apiSecret,
        sourceDir,
        artifactsDir: buildDir,
    }, {
        shouldExitProgram: false,
    });

    if (downloadedFiles) {
        const [downloadedXpi] = downloadedFiles;

        // Rename
        const basePath = path.dirname(downloadedXpi);
        const xpiPath = path.join(basePath, XPI_NAME);
        await fs.rename(downloadedXpi, xpiPath);

        console.log(chalk.greenBright(`File saved to ${xpiPath}\n`));
    }
}

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
                    applications: {
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
                        applications: {
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
    if (!manifest?.applications?.gecko) {
        throw new Error('Manifest is missing gecko section');
    }

    const { id, strict_min_version: strictMinVersion } = manifest.applications.gecko;
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

const updateFirefoxManifest = async () => {
    const manifestPath = path.resolve(BUILD, BUILD_ENVS_MAP[BUILD_ENV].outputPath, Browser.Firefox, 'manifest.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
    // TODO stop building xpi for next versions
    // build xpi for release without update url, so firefox would search extension in the amo store
    // https://discourse.mozilla.org/t/migrate-from-self-hosted-to-add-ons-store/5403
    if (BUILD_ENV !== BuildEnv.Release) {
        manifest.applications.gecko.update_url = FIREFOX_UPDATE_URL;
    }
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 4));
};

const generateFirefoxArtifacts = async () => {
    try {
        await updateFirefoxManifest();
        await generateXpi();
        const manifest = await getFirefoxManifest();
        await createUpdateJson(manifest);
    } catch (error: unknown) {
        console.error(chalk.redBright(getErrorMessage(error)));
        console.error(error);
        // Fail the task execution
        process.exit(1);
    }
};

generateFirefoxArtifacts();
