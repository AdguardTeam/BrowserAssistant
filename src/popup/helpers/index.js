import { SHOW_MODAL_TIME } from '../stores/consts';

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

export const invokeAfterDelay = (func, time = SHOW_MODAL_TIME.SHORT) => {
    return () => setTimeout(func, time);
};

export const handleFocusOnce = (flag, open, close) => {
    return () => {
        if (flag) {
            open();
            close();
        }
    };
};
