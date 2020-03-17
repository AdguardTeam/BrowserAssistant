import requests from './requestsApi';
import actions from './actions';
import tabs from './Tabs';
import state from './State';

class Icon {
    updateIconState = async () => {
        const {
            currentURL: url, currentPort: port,
        } = await tabs.getCurrentTabUrlProperties();

        const response = await requests.getCurrentFilteringState({
            url,
            port,
        });

        const { isFilteringEnabled } = response.parameters;
        const { isInstalled, isRunning, isProtectionEnabled } = response.appState;

        state.setIsFilteringEnabled(isFilteringEnabled);
        state.setIsInstalled(isInstalled);
        state.setIsRunning(isRunning);
        state.setIsProtectionEnabled(isProtectionEnabled);

        return state.isAppWorking;
    };

    updateIconColor = async (tabId) => {
        try {
            let id = tabId;
            if (!tabId) {
                const tab = await tabs.getCurrent();
                id = tab && tab.id;
            }

            if (id) {
                if (state.isAppWorking) {
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
        await this.updateIconState();
        await this.updateIconColor(tabId);
    };

    updateIconColorReloadListener = async (tabId, changeInfo) => {
        if (changeInfo.status === 'loading') {
            await this.updateIconColorListener({ tabId });
        }
    };
}

export default new Icon();
