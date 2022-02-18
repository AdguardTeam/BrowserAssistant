import { BACKGROUND_MESSAGES, POPUP_MESSAGES } from '../../lib/types';
import log from '../../lib/logger';

let openedPort = null;

/**
 * Sets opened port
 * @param {object | null} value
 */
const setOpenedPort = (value) => {
    openedPort = value;
};

export class LongLivedMessageService {
    init(port) {
        if (openedPort) {
            // close previously opened popup to avoid situation of two opened popups
            openedPort.postMessage({
                type: BACKGROUND_MESSAGES.CLOSE_POPUP,
                popupId: openedPort.name,
            });
        }

        setOpenedPort(port);

        port.onDisconnect.addListener(async () => {
            log.debug(`Popup with id "${port.name}" closed`);
            if (port === openedPort) {
                setOpenedPort(null);
            }
        });
    }

    notifyPopupStateUpdated(appState, updateStatusInfo) {
        if (!openedPort) {
            return;
        }

        openedPort.postMessage({
            type: POPUP_MESSAGES.STATE_UPDATED,
            data: {
                appState,
                updateStatusInfo,
            },
        });
    }

    notifyPopupFilteringPauseTimeout(hostnameToTimeoutMap) {
        if (!openedPort) {
            return;
        }

        openedPort.postMessage({
            type: POPUP_MESSAGES.UPDATE_FILTERING_PAUSE_TIMEOUT,
            data: {
                filteringPauseMap: hostnameToTimeoutMap,
            },
        });
    }
}
