const channelMap = {
    dev: 'browserassistantdev@adguard.com',
    beta: 'browserassistantbeta@adguard.com',
    release: 'browserassistant@adguard.com',
};

module.exports = {
    applications: {
        gecko: {
            id: channelMap[process.env.CHANNEL],
            strict_min_version: '54.0',
        },
    },
    background: {
        page: 'background.html',
    },
};
