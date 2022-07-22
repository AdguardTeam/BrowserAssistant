const config = require('../../package.json');

const versions = {
    version: config.version,
    apiVersion: config.apiVersion,
    userAgent: self.navigator.userAgent,
};

export default versions;
