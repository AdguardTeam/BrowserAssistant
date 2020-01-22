/* eslint no-console: 0 */
const Crx = require('crx');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const config = require('../package');
const { BUILD_PATH, ENV_MAP, CERTIFICATE_PATH } = require('./consts');

const CRX_FILENAME = `${config.name}-${config.version}.crx`;

const LOAD_PATH = `${BUILD_PATH}/${ENV_MAP.beta.outputPath}/chrome`;
const WRITE_FILE_PATH = `${BUILD_PATH}/${process.env.NODE_ENV}`;

const ABSOLUTE_LOAD_PATH = path.resolve(__dirname, LOAD_PATH);
const ABSOLUTE_WRITE_PATH = path.resolve(__dirname, WRITE_FILE_PATH);

let privateKey;

try {
    privateKey = fs.readFileSync(CERTIFICATE_PATH);
} catch (error) {
    console.error(chalk.redBright('Error:  Can not create the crx file - the certificate is not found'));
    return;
}

const crx = new Crx({
    privateKey,
});

(async () => {
    try {
        const loadedFile = await crx.load(ABSOLUTE_LOAD_PATH);
        const crxBuffer = await loadedFile.pack();
        await fs.promises.writeFile(`${ABSOLUTE_WRITE_PATH}/${CRX_FILENAME}`, crxBuffer);

        console.log(chalk.greenBright(`Success: The file ${CRX_FILENAME} has been saved in ${ABSOLUTE_WRITE_PATH}`));
    } catch (error) {
        console.error(error.message);
    }
})();
