/* eslint no-console: 0 */
const Crx = require('crx');
const path = require('path');
const fs = require('fs');
const { LOAD_PATH, WRITE_FILE_PATH, CERTIFICATE_PATH } = require('./consts');
const config = require('../package');

const CURRENT_LOAD_PATH = LOAD_PATH[process.env.NODE_ENV];
const CURRENT_WRITE_FILE_PATH = WRITE_FILE_PATH[process.env.NODE_ENV];
const CRX_FILENAME = `${config.name}-${config.version}.crx`;
const WRITE_FILE_FULL_PATH = `${CURRENT_WRITE_FILE_PATH}/${CRX_FILENAME}`;

let privateKey;

try {
    privateKey = fs.readFileSync(CERTIFICATE_PATH);
} catch (error) {
    console.error('\x1b[31m', 'Error:  Can not create the crx file - the certificate is not found');
    return;
}

const crx = new Crx({
    privateKey,
});

(async () => {
    try {
        const loadPath = path.resolve(__dirname, CURRENT_LOAD_PATH);
        const loadedFile = await crx.load(loadPath);
        const crxBuffer = await loadedFile.pack();
        await fs.promises.writeFile(WRITE_FILE_FULL_PATH, crxBuffer);
        console.log('\x1b[32m', `Success: The file ${CRX_FILENAME} has been saved in ${loadPath}`);
    } catch (error) {
        console.error(error.message);
    }
})();
