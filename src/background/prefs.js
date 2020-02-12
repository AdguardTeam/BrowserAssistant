import { getUrl } from './browserApi/runtime';
import { lazyGet } from '../lib/helpers';
import { ICON_COLORS } from '../lib/conts';

const ICONS_PATH = 'assets/images/icons';

export const Prefs = {
    get ICONS() {
        return lazyGet(Prefs, 'ICONS', () => ({
            [ICON_COLORS.GREEN]: {
                19: getUrl(`${ICONS_PATH}/green-19.png`),
                38: getUrl(`${ICONS_PATH}/green-38.png`),
                128: getUrl(`${ICONS_PATH}/green-128.png`),
            },
            [ICON_COLORS.GREY]: {
                19: getUrl(`${ICONS_PATH}/grey-19.png`),
                38: getUrl(`${ICONS_PATH}/grey-38.png`),
            },
        }));
    },
};
