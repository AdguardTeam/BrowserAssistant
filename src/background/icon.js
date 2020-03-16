import requests from './requestsApi';
import Api from './Api';
import actions from './actions';
import tabs from './tabs';

class Icon {
    isFilteringEnabled = true;

    isInstalled = true;

    isRunning = true;

    isProtectionEnabled = true;

    isAppUpToDate = true;

    isExtensionUpdated = true;

    isSetupCorrect = true;

    get isAppWorking() {
        return [this.isInstalled, this.isRunning, this.isProtectionEnabled, this.isAppUpToDate,
            this.isExtensionUpdated, tabs.isSetupCorrect, this.isFilteringEnabled]
            .every((state) => state === true);
    }

    updateIsAppWorking = async () => {
        const {
            currentURL: url, currentPort: port,
        } = await tabs.getCurrentTabUrlProperties();
        const response = await requests.getCurrentFilteringState({
            url,
            port,
        });
        const { isFilteringEnabled } = response.parameters;
        const { isInstalled, isRunning, isProtectionEnabled } = response.appState;
        const { isExtensionUpdated, isAppUpToDate } = Api;

        this.isFilteringEnabled = isFilteringEnabled;
        this.isInstalled = isInstalled;
        this.isRunning = isRunning;
        this.isProtectionEnabled = isProtectionEnabled;
        this.isAppUpToDate = isAppUpToDate;
        this.isExtensionUpdated = isExtensionUpdated;

        return this.isAppWorking;
    };

    updateIconColor = async (tabId) => {
        try {
            let id = tabId;
            if (!tabId) {
                const tab = await tabs.getCurrent();
                id = tab && tab.id;
            }

            if (id) {
                if (this.isAppWorking) {
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
        await this.updateIsAppWorking();
        this.updateIconColor(tabId);
    };

    updateIconColorReloadListener = async (tabId, changeInfo) => {
        if (changeInfo.status === 'loading') {
            this.updateIconColorListener({ tabId });
        }
    };
}

export default new Icon();
