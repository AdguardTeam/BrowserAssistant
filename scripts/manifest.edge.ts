import { MIN_SUPPORTED_VERSION } from '../constants';

module.exports = {
    'background': {
        'service_worker': 'background.js',
    },
    'action': {
        'default_icon': {
            '19': 'assets/images/icons/green-19.png',
            '38': 'assets/images/icons/green-38.png',
        },
        'default_title': '__MSG_name__',
        'default_popup': 'popup.html',
    },
    minimum_edge_version: String(MIN_SUPPORTED_VERSION.CHROMIUM),
};
