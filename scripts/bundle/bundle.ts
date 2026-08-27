/**
 * @file Defines the bundle CLI command that builds the extension.
 */
import { program } from 'commander';

import { Browser, BuildEnv } from '../consts';
import { cliLog } from '../cli-log';
import { getRspackConfig } from '../rspack.config';

import { bundleRspack } from './bundle-runner';

type Task = (options: TaskOptions) => Promise<void> | void;

interface TaskOptions {
    watch?: boolean
}

export const bundle = () => {
    const bundleChrome: Task = (options: TaskOptions) => {
        const rspackConfig = getRspackConfig(Browser.Chrome, options.watch);
        return bundleRspack(rspackConfig, options.watch ?? false, Browser.Chrome);
    };

    const bundleEdge: Task = (options: TaskOptions) => {
        const rspackConfig = getRspackConfig(Browser.Edge, options.watch);
        return bundleRspack(rspackConfig, options.watch ?? false, Browser.Edge);
    };

    const bundleFirefox: Task = (options: TaskOptions) => {
        const rspackConfig = getRspackConfig(Browser.Firefox, options.watch);
        return bundleRspack(rspackConfig, options.watch ?? false, Browser.Firefox);
    };

    const devPlan = [
        bundleChrome,
        bundleFirefox,
        bundleEdge,
    ];

    const betaPlan = [
        bundleChrome,
        bundleFirefox,
        bundleEdge,
    ];

    const releasePlan = [
        bundleChrome,
        bundleFirefox,
        bundleEdge,
    ];

    const runBuild = async (tasks: Task[], watch: boolean) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const task of tasks) {
            // eslint-disable-next-line no-await-in-loop
            await task({ watch });
        }
    };

    const mainBuild = async (watch: boolean) => {
        switch (process.env.BUILD_ENV) {
            case BuildEnv.Dev: {
                await runBuild(devPlan, watch);
                break;
            }
            case BuildEnv.Beta: {
                await runBuild(betaPlan, watch);
                break;
            }
            case BuildEnv.Release: {
                await runBuild(releasePlan, watch);
                break;
            }
            default:
                throw new Error('Provide BUILD_ENV to choose correct build plan');
        }
    };

    const main = async (watch: boolean) => {
        try {
            await mainBuild(watch);
        } catch (e) {
            // @ts-ignore
            cliLog.error(e);
            process.exit(1);
        }
    };

    const chrome = async (watch: boolean) => {
        try {
            await bundleChrome({ watch });
        } catch (e) {
            cliLog.error(JSON.stringify(e));
            process.exit(1);
        }
    };

    const firefox = async (watch: boolean) => {
        try {
            await bundleFirefox({ watch });
        } catch (e) {
            cliLog.error(JSON.stringify(e));
            process.exit(1);
        }
    };

    const edge = async (watch: boolean) => {
        try {
            await bundleEdge({ watch });
        } catch (e) {
            cliLog.error(JSON.stringify(e));
            process.exit(1);
        }
    };

    program
        .option('--watch', 'Builds in watch mode', false);

    program
        .command('chrome')
        .description('Builds extension for chrome browser')
        .action(() => {
            chrome(program.opts().watch);
        });

    program
        .command('firefox')
        .description('Builds extension for firefox browser')
        .action(() => {
            firefox(program.opts().watch);
        });

    program
        .command('edge')
        .description('Builds extension for edge browser')
        .action(() => {
            edge(program.opts().watch);
        });

    program
        .description('By default builds for all platforms')
        .action(() => {
            main(program.opts().watch);
        });

    program.parse(process.argv);
};
