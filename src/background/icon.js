import requests from './requestsApi';
import Api from './Api';
import actions from './actions';
import tabs from './tabs';

class Icon {
    getIsAppWorking = async () => {
        const {
            currentURL: url, currentPort: port,
        } = await tabs.getCurrentTabUrlProperties();
        const response = await requests.getCurrentFilteringState({
            url,
            port,
        });
        const { isHttpsFilteringEnabled, isFilteringEnabled } = response.parameters;

        const { isInstalled, isRunning, isProtectionEnabled } = response.appState;
        const { isExtensionUpdated } = Api;

        const isAppWorking = [isInstalled, isRunning, isProtectionEnabled,
            isExtensionUpdated, tabs.isSetupCorrect, isHttpsFilteringEnabled, isFilteringEnabled]
            .every((state) => state === true);

        return isAppWorking;
    };

    updateIconColor = async (isAppWorking, tabId) => {
        try {
            let id = tabId;
            if (!tabId) {
                const tab = await tabs.getCurrent();
                id = tab && tab.id;
            }

            if (id) {
                if (isAppWorking) {
                    await actions.setIconEnabled(id);
                } else {
                    await actions.setIconDisabled(id);
                }
            }
        } catch (error) {
            // Ignore message
        }
    };

    updateIconColorListener = async ({ tabId }) => {
        const isAppWorking = await this.getIsAppWorking();

        this.updateIconColor(isAppWorking, tabId);
    };

    updateIconColorReloadListener = async (tabId, changeInfo) => {
        if (changeInfo.status === 'loading') {
            this.updateIconColorListener({ tabId });
        }
    };
}

export default new Icon();
