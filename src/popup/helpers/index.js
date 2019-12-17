export const getPortByProtocol = (protocol) => {
    let defaultPort;
    switch (protocol) {
        case 'https:':
            defaultPort = 443;
            break;
        case 'http:':
            defaultPort = 80;
            break;
        default:
            defaultPort = 0;
    }
    return defaultPort;
};
