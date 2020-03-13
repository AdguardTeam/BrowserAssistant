import { MESSAGE_TYPES } from '../../lib/types';
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
        case MESSAGE_TYPES.SHOW_IS_NOT_INSTALLED:
            setInstalled(false);
            setExtensionLoadingAndPending();
            break;
        case MESSAGE_TYPES.SHOW_RELOAD:
            setExtensionLoading(true);
            break;
        case MESSAGE_TYPES.SHOW_SETUP_INCORRECT:
        case MESSAGE_TYPES.ok:
            setExtensionLoadingAndPending();
            break;
        default:
            break;
    }
};
