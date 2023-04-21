import { BUILD_ENV, BuildEnv } from './consts';

const IDS_MAP = {
    [BuildEnv.Dev]: 'browserassistantdev@adguard.com',
    [BuildEnv.Beta]: 'browserassistantbeta@adguard.com',
    [BuildEnv.Release]: 'browserassistant@adguard.com',
};

module.exports = {
    manifest_version: 2,
    applications: {
        gecko: {
            id: IDS_MAP[BUILD_ENV],
            strict_min_version: '54.0',
        },
    },
    'browser_action': {
        'default_icon': {
            '19': 'assets/images/icons/green-19.png',
            '38': 'assets/images/icons/green-38.png',
        },
        'default_title': '__MSG_name__',
        'default_popup': 'popup.html',
    },
    background: {
        page: 'background.html',
    },
};
