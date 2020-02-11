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
    const formattedProtocol = protocol && protocol.slice(0, -1).toUpperCase();
    return PROTOCOLS[formattedProtocol] || PROTOCOLS.SECURED;
};

export const getFormattedPortByProtocol = (port, protocol) => {
    const defaultPort = protocolToPortMap[protocol];
    return port === '' ? defaultPort : Number(port);
};
