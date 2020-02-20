import { deepCloneObject } from '../helpers';

const CURRENT_LEVEL = 'DEBUG';

const LEVELS = {
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEBUG: 4,
};

const print = (level, method, args) => {
    // check log level
    if (LEVELS[CURRENT_LEVEL] < LEVELS[level]) {
        return;
    }
    if (!args || args.length === 0 || !args[0]) {
        return;
    }

    const now = new Date();
    const formatted = `${now.toISOString()}:`;
    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/Console/log
     * This way you are sure you are seeing the value of obj at the moment you log it.
     */
    const msg = args.map((arg) => (typeof arg === 'object' ? deepCloneObject(arg) : arg));
    // eslint-disable-next-line no-console
    console[method](formatted, ...msg);
};

const log = {
    debug(...args) {
        print('DEBUG', 'log', args);
    },

    info(...args) {
        print('INFO', 'info', args);
    },

    warn(...args) {
        print('WARN', 'warn', args);
    },

    error(...args) {
        print('ERROR', 'error', args);
    },
};

export default log;
