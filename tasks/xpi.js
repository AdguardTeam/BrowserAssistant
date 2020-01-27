/* eslint-disable no-console */
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const credentials = require('../private/AdguardBrowserAssistant/mozilla_credentials.json');
const { BROWSER_TYPES, ENV_MAP } = require('./consts');

const { AMO_JWT_ISSUER, AMO_JWT_SECRET } = credentials;
const { NODE_ENV } = process.env;

async function generateXpi() {
    try {
        const sourceDir = `build/${ENV_MAP[NODE_ENV].outputPath}/${BROWSER_TYPES.FIREFOX}`;
        const artifactsDir = `build/${ENV_MAP[NODE_ENV].outputPath}`;
        const command = `yarn web-ext sign --api-key ${AMO_JWT_ISSUER} --api-secret ${AMO_JWT_SECRET} -s ${sourceDir} -a ${artifactsDir}`;

        console.log(command);
        const { stdout, stderr } = await exec(command);

        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
    } catch (error) {
        console.error(error.message);
    }
}

generateXpi();
