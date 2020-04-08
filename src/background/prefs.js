import { getUrl } from '../lib/browserApi/runtime';
import { lazyGet } from '../lib/helpers';

const ICONS_PATH = 'assets/images/icons';

export const Prefs = {
    get ICONS() {
        return lazyGet(Prefs, 'ICON', () => ({
            ENABLED: {
                19: getUrl(`${ICONS_PATH}/green-19.png`),
                38: getUrl(`${ICONS_PATH}/green-38.png`),
                128: getUrl(`${ICONS_PATH}/green-128.png`),
            },
            DISABLED: {
                19: getUrl(`${ICONS_PATH}/grey-19.png`),
                38: getUrl(`${ICONS_PATH}/grey-38.png`),
            },
        }));
    },
    get platform() {
        return lazyGet(Prefs, 'platform', () => ({
            isWindowsOs() {
                return navigator.userAgent.toLowerCase().indexOf('win') >= 0;
            },
            isMacOs() {
                return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            },
        }));
    },
};
