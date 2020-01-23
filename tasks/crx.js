/* eslint no-console: 0 */
const fs = require('fs');
const path = require('path');
const Crx = require('crx');
const chalk = require('chalk');
const {
    UPDATE_URL, MANIFEST_NAME, BROWSER_TYPES,
} = require('./consts');
const { updateManifest } = require('./helpers');
const config = require('../package');
const { BUILD_PATH, ENV_MAP, CERTIFICATE_PATH } = require('./consts');

const CRX_FILENAME = `${config.name}-${config.version}.crx`;
const { NODE_ENV } = process.env;

const LOAD_PATH = [BUILD_PATH, ENV_MAP[NODE_ENV].outputPath, BROWSER_TYPES.CHROME].join('/');
const WRITE_FILE_PATH = [BUILD_PATH, NODE_ENV].join('/');
const MANIFEST_PATH = [BUILD_PATH, NODE_ENV, BROWSER_TYPES.CHROME, MANIFEST_NAME].join('/');

const ABSOLUTE_LOAD_PATH = path.resolve(__dirname, LOAD_PATH);
const ABSOLUTE_WRITE_PATH = path.resolve(__dirname, WRITE_FILE_PATH);
const ABSOLUTE_MANIFEST_PATH = path.resolve(__dirname, MANIFEST_PATH);

const getPrivateKey = () => {
    let privateKey;
    try {
        privateKey = fs.readFileSync(CERTIFICATE_PATH);
        console.log(chalk.greenBright(`\nThe certificate is read from ${CERTIFICATE_PATH}\n`));
    } catch (error) {
        console.error(chalk.redBright(`Can not create ${CRX_FILENAME} - the valid certificate is not found in ${CERTIFICATE_PATH} - ${error.message}\n`));
        throw new Error(error.message);
    }
    return privateKey;
};

const updateChromeManifest = async (chromeManifest, additionalPropsObj) => {
    try {
        const updatedManifest = updateManifest(chromeManifest, additionalPropsObj);
        await fs.promises.writeFile(ABSOLUTE_MANIFEST_PATH, updatedManifest);

        const info = chromeManifest && additionalPropsObj
            ? `is updated with properties ${JSON.stringify(additionalPropsObj)} to create ${CRX_FILENAME} at ${ABSOLUTE_MANIFEST_PATH}`
            : 'is reset';

        console.log(chalk.greenBright(`${MANIFEST_NAME} ${info}\n`));
    } catch (error) {
        console.error(chalk.redBright(`Error: Can not update ${MANIFEST_NAME} - ${error.message}\n`));
        throw new Error(error.message);
    }
};

const createCrx = async (crx) => {
    try {
        const loadedFile = await crx.load(ABSOLUTE_LOAD_PATH);
        const crxBuffer = await loadedFile.pack();
        const writePath = [ABSOLUTE_WRITE_PATH, CRX_FILENAME].join('/');

        await fs.promises.writeFile(writePath, crxBuffer);

        console.log(chalk.greenBright(`${CRX_FILENAME} saved in ${ABSOLUTE_WRITE_PATH}\n`));
    } catch (error) {
        console.error(chalk.redBright(`Error: Can not create ${CRX_FILENAME} - ${error.message}\n`));
        throw new Error(error.message);
    }
};

(async () => {
    try {
        const chromeManifest = await fs.promises.readFile(ABSOLUTE_MANIFEST_PATH);
        const privateKey = getPrivateKey();

        const crx = new Crx({
            privateKey,
        });

        await updateChromeManifest(chromeManifest, { update_url: UPDATE_URL });
        await createCrx(crx);
        await updateChromeManifest(chromeManifest);
    } catch (error) {
        console.error(error.message);
    }
})();
