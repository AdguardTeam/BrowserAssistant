import { PROTOCOLS, protocolToPortMap } from '../popup/stores/consts';

/**
 * Returns hostname of url if it was correct, otherwise return input url
 * @param {string} url
 * @returns {string}
 */
export const getUrlProperties = (url) => {
    let urlObj;

    try {
        urlObj = new URL(url);
    } catch (e) {
        return url;
    }

    return urlObj;
};

export const getProtocol = (protocol) => {
    const formattedProtocol = protocol && protocol.slice(0, -1)
        .toUpperCase();
    return PROTOCOLS[formattedProtocol] || PROTOCOLS.SECURED;
};

export const getFormattedPortByProtocol = (port, protocol) => {
    const defaultPort = protocolToPortMap[protocol];
    return port === '' ? defaultPort : Number(port);
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
 * Flattens the object by mapping it's key to the specified value of the nested object
 * @param {Object.<string,Object.<string,any>>} obj
 * @param {string} prop
 * @returns {Object.<string,any>}
 */
export const flat = (obj, propName) => {
    return Object.fromEntries(
        Object.entries(obj)
            .map(([key, value]) => [key, value[propName]])
    );
};
