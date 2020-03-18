import actions from './actions';
import tabs from './Tabs';
import state from './State';

class Icon {
    updateIconColor = async (tabId) => {
        try {
            const id = tabId || (await tabs.getCurrent()).id;

            if (state.isAppWorking) {
                await actions.setIconEnabled(id);
            } else {
                await actions.setIconDisabled(id);
            }
        } catch (error) {
            // Ignore message
        }
    };

    updateIconColorListener = async ({ tabId }) => {
        await this.updateIconColor(tabId);
    };

    updateIconColorReloadListener = async (tabId, changeInfo) => {
        if (changeInfo.status === 'loading') {
            await this.updateIconColorListener({ tabId });
        }
    };
}

export default new Icon();
