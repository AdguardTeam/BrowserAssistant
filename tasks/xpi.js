/* eslint-disable no-console */
const webExt = require('web-ext');
const path = require('path');
const { promises: fs } = require('fs');
const chalk = require('chalk');
const credentials = require('../private/AdguardBrowserAssistant/mozilla_credentials.json');
const {
    BROWSER_TYPES, ENV_MAP, FIREFOX_CODEBASE, BUILD_PATH, MANIFEST_NAME, FIREFOX_UPDATER_FILENAME,
} = require('./consts');
const config = require('../package');

const { apiKey, apiSecret } = credentials;
const { NODE_ENV } = process.env;
const { outputPath } = ENV_MAP[NODE_ENV];
const BUILD = 'build';

const buildDir = path.resolve(BUILD, ENV_MAP[NODE_ENV].outputPath);
const fileDir = path.resolve(buildDir, FIREFOX_UPDATER_FILENAME);

const getFirefoxManifest = async () => {
    const MANIFEST_PATH = path.resolve(
        __dirname, BUILD_PATH, outputPath, BROWSER_TYPES.FIREFOX, MANIFEST_NAME
    );
    const manifestBuffer = await fs.readFile(MANIFEST_PATH);
    const manifest = JSON.parse(manifestBuffer.toString());
    return manifest;
};

async function generateXpi() {
    try {
        const sourceDir = path.resolve(BUILD, ENV_MAP[NODE_ENV].outputPath, BROWSER_TYPES.FIREFOX);
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
            console.log(chalk.greenBright(`file saved ${downloadedXpi}\n`));
        }
    } catch (error) {
        console.error(error.message);
    }
}

const getFileContent = (
    {
        // eslint-disable-next-line camelcase
        id, version, update_link, strict_min_version,
    }
) => ({
    addons: {
        [id]: {
            updates: [
                {
                    version,
                    update_link,
                    applications: {
                        gecko: {
                            strict_min_version,
                        },
                    },
                },
            ],
        },
    },
});

const createUpdateJson = async (manifest) => {
    try {
        // eslint-disable-next-line camelcase
        const { id, strict_min_version } = manifest.applications.gecko;

        const fileContent = getFileContent(
            {
                id, version: config.version, update_link: FIREFOX_CODEBASE, strict_min_version,
            }
        );

        const fileJson = JSON.stringify(fileContent, null, 4);

        await fs.writeFile(fileDir, fileJson);
        console.log(chalk.greenBright(`${FIREFOX_UPDATER_FILENAME} saved in ${buildDir}\n`));
    } catch (error) {
        console.error(chalk.redBright(`Error: Can not create ${FIREFOX_UPDATER_FILENAME} - ${error.message}\n`));
        throw error;
    }
};

const generateFirefoxArtifacts = async () => {
    try {
        await generateXpi();
        const manifest = await getFirefoxManifest();
        await createUpdateJson(manifest);
    } catch (error) {
        console.error(chalk.redBright(error.message));
    }
};

generateFirefoxArtifacts();
