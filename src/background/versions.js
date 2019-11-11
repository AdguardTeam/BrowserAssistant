const config = require('../../package.json');

const versions = {
    version: config.version,
    apiVersion: '1',
    userAgent: window.navigator.userAgent,
};

export default versions;
