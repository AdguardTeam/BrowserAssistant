import { MESSAGE_TYPES } from '../../lib/types';

const getMessageHandler = (rootStore) => {
    const {
        settingsStore: {
            setInstalled,
            setCurrentAppState,
        },
        uiStore: {
            setExtensionLoadingAndPending,
            setExtensionLoading,
        },
    } = rootStore;

    return async (msg) => {
        const { type, params } = msg;
        switch (type) {
            case MESSAGE_TYPES.SHOW_IS_NOT_INSTALLED:
                setInstalled(false);
                setExtensionLoadingAndPending();
                break;
            case MESSAGE_TYPES.SHOW_RELOAD:
                setExtensionLoading(true);
                break;
            case MESSAGE_TYPES.ERROR:
            case MESSAGE_TYPES.SHOW_SETUP_INCORRECT:
                setExtensionLoadingAndPending();
                break;
            case MESSAGE_TYPES.OK:
                setExtensionLoadingAndPending();
                await setCurrentAppState(params.appState);
                break;
            default:
                break;
        }
    };
};
export default getMessageHandler;
