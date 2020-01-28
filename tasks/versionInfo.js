/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { BUILD_PATH, ENV_MAP } = require('./consts');
const config = require('../package');

const VERSION = `version=v${config.version}`;
const { NODE_ENV } = process.env;
const { outputPath } = ENV_MAP[NODE_ENV];
const FILENAME = 'build.txt';

const WRITE_PATH = path.resolve(__dirname, BUILD_PATH, outputPath, FILENAME);

const createBuildVersion = async () => {
    try {
        await fs.promises.writeFile(WRITE_PATH, VERSION);
        console.log(chalk.greenBright(`${FILENAME} saved in ${WRITE_PATH}\n`));
    } catch (error) {
        console.error(chalk.redBright(`Error: Can not create ${FILENAME} - ${error.message}\n`));
        throw error;
    }
};

createBuildVersion();
