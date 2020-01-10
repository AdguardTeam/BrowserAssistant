import { modalStatesNames } from '../stores/consts';

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
            defaultState = { [modalStatesNames.isHovered]: true };
            break;
        case 'mouseout':
            defaultState = { [modalStatesNames.isHovered]: false };
            break;
        case 'focus':
            defaultState = { [modalStatesNames.isFocused]: true };
            break;
        case 'blur':
            defaultState = { [modalStatesNames.isFocused]: false };
            break;
        case 'keydown':
            defaultState = { [modalStatesNames.isEntered]: true };
            break;
        case 'mousedown':
            defaultState = { [modalStatesNames.isClicked]: true };
            break;
        default:
            break;
    }
    return defaultState;
};

/**
 * @param {object} params
 * @returns {boolean}
 */
export const checkSomeIsTrue = (modalState) => {
    return (Object.values(modalState).some(state => state === true));
};
