/* eslint-disable no-console */
const webExt = require('web-ext');
const path = require('path');
const fs = require('fs').promises;
const chalk = require('chalk');

const {
    BROWSER_TYPES,
    BUILD_PATH,
    BUILD_ENVS_MAP,
    FIREFOX_UPDATER_FILENAME,
    FIREFOX_UPDATE_URL,
    FIREFOX_UPDATE_XPI,
    MANIFEST_NAME,
    XPI_NAME,
} = require('./consts');
const config = require('../package');

const { BUILD_ENV } = process.env;
const { outputPath } = BUILD_ENVS_MAP[BUILD_ENV];
const BUILD = 'build';

const buildDir = path.resolve(BUILD, BUILD_ENVS_MAP[BUILD_ENV].outputPath);
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
    const sourceDir = path.resolve(BUILD, BUILD_ENVS_MAP[BUILD_ENV].outputPath,
        BROWSER_TYPES.FIREFOX);

    const credentialsPath = path.resolve(__dirname, '../private/AdguardBrowserAssistant/mozilla_credentials.json');

    // require called here in order to escape errors, until this module is really necessary
    // eslint-disable-next-line global-require
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

const generateUpdateJson = (
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

        const fileContent = generateUpdateJson(
            {
                id,
                version: config.version,
                update_link: FIREFOX_UPDATE_XPI,
                strict_min_version,
            }
        );

        const fileJson = JSON.stringify(fileContent, null, 4);

        await fs.writeFile(fileDir, fileJson);
        console.log(chalk.greenBright(`${FIREFOX_UPDATER_FILENAME} saved in ${buildDir}\n`));
    } catch (error) {
        console.error(chalk.redBright(`Error: cannot create ${FIREFOX_UPDATER_FILENAME} - ${error.message}\n`));
        throw error;
    }
};

const updateFirefoxManifest = async () => {
    const manifestPath = path.resolve(BUILD, BUILD_ENVS_MAP[BUILD_ENV].outputPath, BROWSER_TYPES.FIREFOX, 'manifest.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
    manifest.applications.gecko.update_url = FIREFOX_UPDATE_URL;
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 4));
};

const generateFirefoxArtifacts = async () => {
    try {
        await updateFirefoxManifest();
        await generateXpi();
        const manifest = await getFirefoxManifest();
        await createUpdateJson(manifest);
    } catch (error) {
        console.error(chalk.redBright(error.message));
        console.error(error);
        // Fail the task execution
        process.exit(1);
    }
};

generateFirefoxArtifacts();
