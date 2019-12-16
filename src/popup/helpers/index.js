export const getPortByProtocol = (protocol) => {
    let standardProtocol = protocol;
    switch (standardProtocol) {
        case 'https:':
            standardProtocol = 443;
            break;
        case 'http:':
            standardProtocol = 80;
            break;
        default:
            standardProtocol = 0;
    }
    return standardProtocol;
};
