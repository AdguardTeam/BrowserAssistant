import { MESSAGE_TYPES } from '../../lib/types';

const getMessageHandler = (rootStore) => {
    const {
        settingsStore: {
            setInstalled,
            setCurrentAppState,
        },
        uiStore: {
            setExtensionLoading,
            setExtensionPending,
        },
    } = rootStore;

    return async (msg) => {
        const { type, params } = msg;

        setExtensionLoading(false);
        setExtensionPending(false);

        switch (type) {
            case MESSAGE_TYPES.SHOW_IS_NOT_INSTALLED:
                setInstalled(false);
                break;
            case MESSAGE_TYPES.SHOW_RELOAD:
                setExtensionLoading(true);
                break;
            case MESSAGE_TYPES.ERROR:
            case MESSAGE_TYPES.SHOW_SETUP_INCORRECT:
                break;
            case MESSAGE_TYPES.OK:
                await setCurrentAppState(params.appState);
                break;
            default:
                break;
        }
    };
};
export default getMessageHandler;
