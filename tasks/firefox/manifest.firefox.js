const envMap = {
    dev: 'browserassistantdev@adguard.com',
    beta: 'browserassistantbeta@adguard.com',
    release: 'browserassistant@adguard.com',
};

module.exports = {
    applications: {
        gecko: {
            id: envMap[process.env.NODE_ENV],
            strict_min_version: '54.0',
        },
    },
    background: {
        page: 'background.html',
    },
};
