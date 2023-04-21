/* eslint-disable no-console */
import chalk from 'chalk';

const info = (text: string) => {
    console.log(text);
};

const error = (text: string) => {
    console.log(chalk.bold.yellow.bgRed(text));
    throw new Error(text);
};

export const cliLog = {
    info,
    error,
};
