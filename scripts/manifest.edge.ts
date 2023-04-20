module.exports = {
    'background': {
        'page': 'background.html',
        'persistent': true,
    },
    'browser_action': {
        'default_icon': {
            '19': 'assets/images/icons/green-19.png',
            '38': 'assets/images/icons/green-38.png',
        },
        'default_title': '__MSG_name__',
        'default_popup': 'popup.html',
    },
    minimum_edge_version: '40.15063.0.0',
};
