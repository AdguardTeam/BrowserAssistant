import { Manifest } from 'webextension-polyfill';

import {
    BUILD_ENV,
    BuildEnv,
    FIREFOX_UPDATE_URL,
} from './consts';

import WebExtensionManifest = Manifest.WebExtensionManifest;

const IDS_MAP = {
    [BuildEnv.Dev]: 'browserassistantdev@adguard.com',
    [BuildEnv.Beta]: 'browserassistantbeta@adguard.com',
    [BuildEnv.Release]: 'browserassistant@adguard.com',
};

// Define a new type that picks only the properties you're using from WebExtensionManifest
type CustomManifestType = Pick<WebExtensionManifest,
'manifest_version' |
'browser_specific_settings' |
'action' |
'background'> & {
    // Include any additional properties used conditionally or optionally here
    browser_specific_settings: {
        gecko: {
            id: string;
            strict_min_version: string;
            update_url?: string; // Since update_url is conditionally added, make it optional
        };
    };
};

const manifest: CustomManifestType = {
    manifest_version: 3,
    browser_specific_settings: {
        gecko: {
            id: IDS_MAP[BUILD_ENV],
            strict_min_version: '109.0',
        },
    },
    'action': {
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

if (BUILD_ENV === BuildEnv.Beta) {
    manifest.browser_specific_settings.gecko.update_url = FIREFOX_UPDATE_URL;
}

module.exports = manifest;
