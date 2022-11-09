/* eslint-disable no-console */
import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import { BUILD_PATH, BUILD_ENVS_MAP, BUILD_ENV } from './consts';
import config from '../package.json';

const content = `version=${config.version}`;
const { outputPath } = BUILD_ENVS_MAP[BUILD_ENV];
const FILENAME = 'build.txt';

const WRITE_PATH = path.resolve(__dirname, BUILD_PATH, outputPath, FILENAME);

export const createBuildVersion = async () => {
    try {
        await fs.writeFile(WRITE_PATH, content);
        console.log(chalk.greenBright(`${FILENAME} saved in ${WRITE_PATH}\n`));
    } catch (error: any) {
        console.error(chalk.redBright(`Error: Can not create ${FILENAME} - ${error.message}\n`));
        throw error;
    }
};
