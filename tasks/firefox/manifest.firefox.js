const envMap = {
    dev: 'browserassistantdev@adguard.com',
    beta: 'browserassistantbeta@adguard.com',
    release: 'browserassistant@adguard.com',
};

module.exports = {
    minimum_chrome_version: '55.0',
    applications: {
        gecko: {
            id: envMap[process.env.NODE_ENV],
            strict_min_version: '52.0',
        },
    },
    background: {
        page: 'background.html',
    },
    permissions: [
        'activeTab',
        'nativeMessaging',
    ],
};
