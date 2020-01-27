/* eslint-disable no-console */
const webExt = require('web-ext');
const credentials = require('../private/AdguardBrowserAssistant/mozilla_credentials.json');
const { BROWSER_TYPES, ENV_MAP } = require('./consts');

const { apiKey, apiSecret } = credentials;
const { NODE_ENV } = process.env;

async function generateXpi() {
    try {
        const sourceDir = `build/${ENV_MAP[NODE_ENV].outputPath}/${BROWSER_TYPES.FIREFOX}`;
        const artifactsDir = `build/${ENV_MAP[NODE_ENV].outputPath}`;

        const res = await webExt.default.cmd.sign({
            apiKey,
            apiSecret,
            sourceDir,
            artifactsDir,
        }, {
            shouldExitProgram: false,
        });

        console.log(res);
    } catch (error) {
        console.error(error.message);
    }
}

generateXpi();
