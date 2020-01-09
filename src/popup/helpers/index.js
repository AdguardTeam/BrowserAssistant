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

export const defineNewState = (eventType) => {
    let defaultState;
    switch (eventType) {
        case 'mouseover':
            defaultState = { isHovered: true };
            break;
        case 'mouseout':
            defaultState = { isHovered: false };
            break;
        case 'focus':
            defaultState = { isFocused: true };
            break;
        case 'blur':
            defaultState = { isFocused: false };
            break;
        case 'keydown':
            defaultState = { isEntered: true };
            break;
        default:
            break;
    }
    return defaultState;
};

export const checkSomeIsTrue = (modalState) => {
    return (Object.values(modalState).some(state => state === true));
};
