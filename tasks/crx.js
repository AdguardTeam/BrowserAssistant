/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const Crx = require('crx');
const chalk = require('chalk');
const {
    CHROME_UPDATE_URL, MANIFEST_NAME, BROWSER_TYPES, BUILD_PATH, ENV_MAP, CERTIFICATE_PATH,
} = require('./consts');
const { updateManifest } = require('./helpers');
const config = require('../package');

const CRX_FILENAME = `${config.name}-${config.version}.crx`;
const { NODE_ENV } = process.env;
const { outputPath } = ENV_MAP[NODE_ENV];

const WRITE_PATH = path.resolve(__dirname, BUILD_PATH, outputPath);
const LOAD_PATH = path
    .resolve(__dirname, BUILD_PATH, outputPath, BROWSER_TYPES.CHROME);
const MANIFEST_PATH = path.resolve(
    __dirname, BUILD_PATH, outputPath, BROWSER_TYPES.CHROME, MANIFEST_NAME
);

const getPrivateKey = async () => {
    let privateKey;
    try {
        privateKey = await fs.promises.readFile(CERTIFICATE_PATH);
        console.log(chalk.greenBright(`\nThe certificate is read from ${CERTIFICATE_PATH}\n`));
    } catch (error) {
        console.error(chalk.redBright(`Can not create ${CRX_FILENAME} - the valid certificate is not found in ${CERTIFICATE_PATH} - ${error.message}\n`));
        throw error;
    }
    return privateKey;
};

/**
 * Writes additionalProps to the chromeManifest
 *
 * @param chromeManifest {object}
 * @param [additionalProps] {object} - props to add in manifest
 */
const updateChromeManifest = async (chromeManifest, additionalProps) => {
    try {
        const updatedManifest = updateManifest(chromeManifest, additionalProps);
        await fs.promises.writeFile(MANIFEST_PATH, updatedManifest);

        const info = chromeManifest && additionalProps
            ? `is updated with properties ${JSON.stringify(additionalProps)} to create ${CRX_FILENAME} at ${MANIFEST_PATH}`
            : 'is reset';

        console.log(chalk.greenBright(`${MANIFEST_NAME} ${info}\n`));
    } catch (error) {
        console.error(chalk.redBright(`Error: Can not update ${MANIFEST_NAME} - ${error.message}\n`));
        throw error;
    }
};

const createCrx = async (crx) => {
    try {
        const loadedFile = await crx.load(LOAD_PATH);
        const crxBuffer = await loadedFile.pack();
        const writePath = [WRITE_PATH, CRX_FILENAME].join('/');

        await fs.promises.writeFile(writePath, crxBuffer);

        console.log(chalk.greenBright(`${CRX_FILENAME} saved in ${WRITE_PATH}\n`));
    } catch (error) {
        console.error(chalk.redBright(`Error: Can not create ${CRX_FILENAME} - ${error.message}\n`));
        throw error;
    }
};

(async () => {
    try {
        const chromeManifest = await fs.promises.readFile(MANIFEST_PATH);
        const privateKey = await getPrivateKey();

        const crx = new Crx({
            privateKey,
        });

        // Add to the chrome manifest `update_url` property
        // which is to be present while creating the crx file
        await updateChromeManifest(chromeManifest, { update_url: CHROME_UPDATE_URL });
        await createCrx(crx);
        // Delete from the chrome manifest `update_url` property
        // after the crx file has been created - reset the manifest
        await updateChromeManifest(chromeManifest);
    } catch (error) {
        console.error(error.message);
    }
})();
