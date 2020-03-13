import {
    BACKGROUND_COMMANDS,
    HOST_RESPONSE_TYPES,
} from '../../lib/types';
import { root } from '../stores';

const {
    settingsStore: {
        setInstalled,
    },
    uiStore: {
        setExtensionLoadingAndPending,
        setExtensionLoading,
    },
} = root;

export default async (msg) => {
    const { type } = msg;
    switch (type) {
        case BACKGROUND_COMMANDS.SHOW_IS_NOT_INSTALLED:
            setInstalled(false);
            setExtensionLoadingAndPending();
            break;
        case BACKGROUND_COMMANDS.SHOW_RELOAD:
            setExtensionLoading(true);
            break;
        case BACKGROUND_COMMANDS.SHOW_SETUP_INCORRECT:
        case HOST_RESPONSE_TYPES.ok:
        default:
            setExtensionLoadingAndPending();
            break;
    }
};
