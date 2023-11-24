import browser from 'webextension-polyfill';

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

    /**
     * Method to detect if browser is vivaldi.
     * @returns {Promise<boolean>}
     */
    async isVivaldiBrowser() {
        if (this.isVivaldiPromise === undefined) {
            this.isVivaldiPromise = new Promise(async (resolve) => {
                try {
                    const tabs = await browser.tabs.query({});
                    if (tabs.length > 0 && Object.prototype.hasOwnProperty.call(tabs[0], 'vivExtData')) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } catch (error) {
                    console.error('Error querying tabs:', error);
                    resolve(false);
                }
            });
        }
        return this.isVivaldiPromise;
    },
};
