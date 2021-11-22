import { lazyGet } from '../helpers';

export const utils = {
    get browser() {
        return lazyGet(utils, 'browser', () => {
            let browser;
            let { userAgent } = navigator;
            userAgent = userAgent.toLowerCase();
            if (userAgent.indexOf('yabrowser') >= 0) {
                browser = 'YaBrowser';
            } else if (userAgent.indexOf('edg') >= 0) {
                browser = 'EdgeChromium';
            } else if (userAgent.indexOf('opera') >= 0
                || userAgent.indexOf('opr') >= 0) {
                browser = 'Opera';
            } else if (userAgent.indexOf('firefox') >= 0) {
                browser = 'Firefox';
            } else {
                browser = 'Chrome';
            }
            return browser;
        });
    },

    get isFirefoxBrowser() {
        return this.browser === 'Firefox';
    },
};
