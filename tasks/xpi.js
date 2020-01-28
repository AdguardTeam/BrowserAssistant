/* eslint-disable no-console */
const webExt = require('web-ext');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const credentials = require('../private/AdguardBrowserAssistant/mozilla_credentials.json');
const {
    BROWSER_TYPES, ENV_MAP, FIREFOX_CODEBASE, BUILD_PATH, MANIFEST_NAME, FIREFOX_UPDATER_FILENAME,
} = require('./consts');
const config = require('../package');

const { apiKey, apiSecret } = credentials;
const { NODE_ENV } = process.env;
const { outputPath } = ENV_MAP[NODE_ENV];

const artifactsDir = `build/${ENV_MAP[NODE_ENV].outputPath}`;
const fileDir = path.resolve(artifactsDir, FIREFOX_UPDATER_FILENAME);

const getFirefoxManifest = async () => {
    const MANIFEST_PATH = path.resolve(
        __dirname, BUILD_PATH, outputPath, BROWSER_TYPES.FIREFOX, MANIFEST_NAME
    );
    const manifestBuffer = await fs.promises.readFile(MANIFEST_PATH);
    const manifest = JSON.parse(manifestBuffer.toString());
    return manifest;
};

async function generateXpi() {
    try {
        console.log(chalk.greenBright('Signing XPI file...\n'));
        const sourceDir = `build/${ENV_MAP[NODE_ENV].outputPath}/${BROWSER_TYPES.FIREFOX}`;

        const xpiStatus = await webExt.default.cmd.sign({
            apiKey,
            apiSecret,
            sourceDir,
            artifactsDir,
        }, {
            shouldExitProgram: false,
        });

        console.log(chalk.greenBright(xpiStatus));
        console.log(chalk.greenBright(`XPI saved in ${artifactsDir}\n`));
    } catch (error) {
        console.error(error.message);
    }
}

const createUpdateJson = async (manifest) => {
    try {
        // eslint-disable-next-line camelcase
        const { id, strict_min_version } = manifest.applications.gecko;

        const fileContent = {
            addons: {
                [id]: {
                    updates: [
                        {
                            version: config.version,
                            update_link: FIREFOX_CODEBASE,
                            applications: {
                                gecko: {
                                    strict_min_version,
                                },
                            },
                        },
                    ],
                },
            },
        };

        const fileJson = JSON.stringify(fileContent, null, 4);

        await fs.promises.writeFile(fileDir, fileJson);
        console.log(chalk.greenBright(`${FIREFOX_UPDATER_FILENAME} saved in ${artifactsDir}\n`));
    } catch (error) {
        console.error(chalk.redBright(`Error: Can not create ${FIREFOX_UPDATER_FILENAME} - ${error.message}\n`));
        throw error;
    }
};

const generateFirefoxArtifacts = async () => {
    try {
        const manifest = await getFirefoxManifest();
        await createUpdateJson(manifest);
        await generateXpi();
    } catch (error) {
        console.error(chalk.redBright(error.message));
    }
};

generateFirefoxArtifacts();
