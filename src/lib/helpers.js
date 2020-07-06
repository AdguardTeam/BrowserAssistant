import {
    PROTOCOLS,
    PROTOCOL_TO_PORT_MAP,
} from '../popup/stores/consts';

/**
 * @typedef {Object} urlObj
 * @property {number} x - The X Coordinate
 * @property {string} urlObj.hash
 * @property {string} urlObj.host
 * @property {string} urlObj.hostname
 * @property {string} urlObj.href
 * @property {string} urlObj.origin
 * @property {string} urlObj.password
 * @property {string} urlObj.pathname
 * @property {string} urlObj.port
 * @property {string} urlObj.protocol
 * @property {string} urlObj.search
 * @property {function} urlObj.searchParams
 * @property {string} urlObj.username
 */

/**
 * Returns hostname of url if it was correct, otherwise return input url
 * @param {string} url
 * @returns {urlObj | string}
 */
export const getUrlProperties = (url) => {
    try {
        const urlObj = new URL(url);
        return urlObj;
    } catch (e) {
        return url;
    }
};

/**
 * Checks if string is chrome-extension: or moz-extension: protocol
 * @param {string} url
 * @returns {boolean}
 */
export const isExtensionProtocol = (protocol) => /^(chrome|moz)-extension:/.test(protocol);

/**
 * @param {string} port
 * @param {'HTTPS' | 'HTTP' | 'SECURED'} protocol
 * @returns {number}
 */
export const getFormattedPort = (port, protocol) => {
    const defaultPort = PROTOCOL_TO_PORT_MAP[protocol];
    return port === '' || !port ? defaultPort : Number(port);
};

/**
 * @param {string} protocol
 * @returns {'HTTPS' | 'HTTP' | 'SECURED'}
 */
export const getFormattedProtocol = (protocol) => {
    const formattedProtocol = protocol && protocol.slice(0, -1).toUpperCase();
    return PROTOCOLS[formattedProtocol] || PROTOCOLS.SECURED;
};

/**
 * @param {string} url
 * @returns {{* protocol: string, hostname: string, port: number}}
 */
export const getUrlProps = (url) => {
    const { hostname, port, protocol } = getUrlProperties(url);
    const formattedProtocol = getFormattedProtocol(protocol);
    const formattedPort = getFormattedPort(port, formattedProtocol);

    return {
        port: formattedPort,
        protocol,
        hostname,
    };
};

/**
 * Checks if string is a valid url with http: or https: protocol
 * @param {string} str
 * @returns {boolean}
 */
export const isHttp = (str) => {
    let url;
    try {
        url = new URL(str);
    } catch (e) {
        return false;
    }
    return /^https?:/.test(url.protocol);
};

/**
 * Returns the value of the property from the cache,
 * otherwise, calculates it using the callback, memoizes it, and returns the value
 * @param {object} obj
 * @param {string} prop
 * @param {function} func
 * @returns {any}
 */
export const lazyGet = (obj, prop, func) => {
    const cachedProp = `_${prop}`;
    if (cachedProp in obj) {
        return obj[cachedProp];
    }

    const value = func.apply(obj);
    // eslint-disable-next-line no-param-reassign
    obj[cachedProp] = value;
    return value;
};

/**
 * Flattens the object by mapping it's key to the specified property of the nested object
 * @param {Object.<string,Object.<string,any>>} obj
 * @param {string} propName
 * @returns {Object.<string,any>}
 */
export const flattenNestedObj = (obj, propName) => {
    return Object.entries(obj)
        .reduce((acc, [key, value]) => {
            acc[key] = value[propName];
            return acc;
        }, {});
};

/**
 * Checks if at least one value of the object is strictly equal to true
 * @param {Object.<string, any>} states
 * @returns {boolean}
 */
export const checkSomeIsTrue = (states) => {
    return Object.values(states)
        .some((state) => state === true);
};

/**
 * If the semver string a is greater than b, return 1.
 * If the semver string b is greater than a, return -1.
 * If a equals b, return 0;
 *
 * @param {string} a
 * @param {string} b
 * @returns {-1 | 0 | 1}
 */
export const compareSemver = (a, b) => {
    const pa = a.split('.');
    const pb = b.split('.');
    for (let i = 0; i < 3; i += 1) {
        const na = Number(pa[i]);
        const nb = Number(pb[i]);
        if (na > nb) return 1;
        if (nb > na) return -1;
        const { isNaN } = Number;
        if (!isNaN(na) && isNaN(nb)) return 1;
        if (isNaN(na) && !isNaN(nb)) return -1;
    }
    return 0;
};
