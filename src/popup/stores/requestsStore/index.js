import log from '../../../lib/logger';
import innerMessaging from '../../../lib/innerMessaging';

class RequestsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    getCurrentFilteringState = async (forceStartApp = false) => {
        const { currentUrl: url, currentPort: port } = this.rootStore.settingsStore;

        try {
            const response = await innerMessaging.getUrlFilteringState({
                url,
                port,
                forceStartApp,
            });

            if (response) {
                this.rootStore.settingsStore.setUrlFilteringState(response.parameters);
            }
        } catch (error) {
            // TODO handle ui state with errors
            log.error(error);
        }
    };

    setFilteringStatus = async () => {
        const {
            currentUrl: url,
            isFilteringEnabled: isEnabled,
            isHttpsFilteringEnabled: isHttpsEnabled,
        } = this.rootStore.settingsStore;

        try {
            await innerMessaging.setFilteringStatus({
                url,
                isEnabled,
                isHttpsEnabled,
            });
        } catch (error) {
            log.error(error);
        }
    };

    startApp = async () => {
        try {
            this.rootStore.uiStore.setExtensionLoading(true);
            await this.getCurrentFilteringState(true);
            this.rootStore.uiStore.setExtensionLoading(false);
        } catch (error) {
            log.error(error);
        }
    };

    updateApp = async () => {
        try {
            await innerMessaging.updateApp();
        } catch (error) {
            log.error(error);
        }
    };
}

export default RequestsStore;
