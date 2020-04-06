const config = require('../../package.json');

const versions = {
    version: config.version,
    apiVersion: config.apiVersion,
    userAgent: window.navigator.userAgent,
};

export default versions;
