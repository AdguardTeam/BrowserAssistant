/**
 * @file Extension and API versions read from the package.json.
 */
import config from '../../package.json';

// package.json carries no version on master (CI stamps it before building);
// fall back for local dev builds.
const version = (config as { version?: string }).version || '0.0.0';

const versions = {
    version,
    apiVersion: config.apiVersion,
    userAgent: self.navigator.userAgent,
};

export default versions;
