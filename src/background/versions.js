const config = require('../../package.json');

// TODO Consider removing this somewhere
const versions = {
    version: config.version,
    apiVersion: config.apiVersion,
    userAgent: window.navigator.userAgent,
};

export default versions;
