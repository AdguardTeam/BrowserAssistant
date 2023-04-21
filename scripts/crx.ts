/* eslint-disable no-console */
import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
const Crx = require('crx');

import {
    Browser,
    BUILD_ENV,
    BUILD_ENVS_MAP,
    BUILD_PATH,
    BuildEnv,
    CERTIFICATE_PATHS,
    CHROME_UPDATE_CRX,
    CHROME_UPDATE_URL,
    CHROME_UPDATER_FILENAME,
    CRX_NAME,
    MANIFEST_NAME,
} from './consts';
import { Manifest, updateManifest } from './helpers';
import { getErrorMessage } from '../src/lib/errors';

const config = require('../package.json');

const { outputPath } = BUILD_ENVS_MAP[BUILD_ENV];

const WRITE_PATH = path.resolve(__dirname, BUILD_PATH, outputPath);
const LOAD_PATH = path
    .resolve(__dirname, BUILD_PATH, outputPath, Browser.Chrome);
const MANIFEST_PATH = path.resolve(
    __dirname, BUILD_PATH, outputPath, Browser.Chrome, MANIFEST_NAME,
);

const getPrivateKey = async () => {
    if (BUILD_ENV === BuildEnv.Dev) {
        throw new Error('Only beta and release have private keys');
    }

    const certificatePath = CERTIFICATE_PATHS[BUILD_ENV];
    try {
        const privateKey = await fs.readFile(certificatePath);
        console.log(chalk.greenBright(`\nThe certificate is read from ${certificatePath}\n`));
        return privateKey;
    } catch (error: unknown) {
        console.error(
            // eslint-disable-next-line max-len
            chalk.redBright(`Can not create ${CRX_NAME} - the valid certificate is not found in ${certificatePath} - ${getErrorMessage(error)}\n`),
        );
        throw error;
    }
};

/**
 * Writes additionalProps to the chromeManifest
 *
 * @param chromeManifest {object}
 * @param [additionalProps] {object} - props to add in manifest
 */
const updateChromeManifest = async (chromeManifest: Buffer, additionalProps?: Partial<Manifest>) => {
    try {
        const updatedManifest = updateManifest(chromeManifest.toString(), additionalProps);
        await fs.writeFile(MANIFEST_PATH, updatedManifest);

        const info = chromeManifest && additionalProps
            ? `is updated with properties ${JSON.stringify(additionalProps)} to create ${CRX_NAME} at ${MANIFEST_PATH}`
            : 'is reset';

        console.log(chalk.greenBright(`${MANIFEST_NAME} ${info}\n`));
    } catch (error: unknown) {
        console.error(chalk.redBright(`Error: Can not update ${MANIFEST_NAME} - ${getErrorMessage(error)}\n`));
        throw error;
    }
};

const createCrx = async (loadedFile: { pack: () => any; }) => {
    try {
        const crxBuffer = await loadedFile.pack();
        const writePath = path.resolve(WRITE_PATH, CRX_NAME);
        await fs.writeFile(writePath, crxBuffer);
        console.log(chalk.greenBright(`${CRX_NAME} saved to ${WRITE_PATH}\n`));
    } catch (error: unknown) {
        console.error(chalk.redBright(`Error: Can not create ${CRX_NAME} - ${getErrorMessage(error)}\n`));
        throw error;
    }
};

const createXml = async (crx: { generateUpdateXML: () => any; }) => {
    const xmlBuffer = await crx.generateUpdateXML();
    const writeXmlPath = path.resolve(WRITE_PATH, CHROME_UPDATER_FILENAME);
    await fs.writeFile(writeXmlPath, xmlBuffer);
    console.log(chalk.greenBright(`${CHROME_UPDATER_FILENAME} saved to ${WRITE_PATH}\n`));
};

const generateChromeFiles = async () => {
    try {
        const rawManifest = await fs.readFile(MANIFEST_PATH);
        const PRIVATE_KEY = await getPrivateKey();

        const crx = new Crx({
            codebase: CHROME_UPDATE_CRX,
            privateKey: PRIVATE_KEY,
            publicKey: config.name,
        });

        // Add to the chrome manifest `update_url` property
        // which is to be present while creating the crx file
        await updateChromeManifest(rawManifest, { update_url: CHROME_UPDATE_URL });
        const loadedFile = await crx.load(LOAD_PATH);
        await createCrx(loadedFile);
        await createXml(crx);
        // Delete from the chrome manifest `update_url` property
        // after the crx file has been created - reset the manifest
        await updateChromeManifest(rawManifest);
    } catch (error: unknown) {
        console.error(chalk.redBright(getErrorMessage(error)));
        console.error(error);

        // Fail the task execution
        process.exit(1);
    }
};

generateChromeFiles();
