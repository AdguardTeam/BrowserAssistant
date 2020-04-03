import throttle from 'lodash/throttle';
import actions from './actions';
import state from './state';
import notifier from '../lib/notifier';
import tabs from './tabs';

class Icon {
    constructor() {
        const throttledUpdater = throttle(async (tab) => {
            if (tab) {
                await this.updateIcon(tab);
            } else {
                // There may be opened more than one window opened
                const activeTabs = await tabs.getActiveTabs();
                activeTabs.forEach((tab) => {
                    this.updateIcon(tab);
                });
            }
        }, 100);

        notifier.addSpecifiedListener(notifier.types.TAB_ACTIVATED, throttledUpdater);
        notifier.addSpecifiedListener(notifier.types.TAB_UPDATED, throttledUpdater);
        notifier.addSpecifiedListener(notifier.types.STATE_UPDATED, throttledUpdater);
    }

    updateIcon = async (tab) => {
        if (!state.isAppWorking()) {
            await actions.setIconDisabled(tab.id); // TODO update all tabs
            return;
        }
        const currentFilteringState = await state.getCurrentFilteringState(tab);
        const isFilteringEnabled = currentFilteringState
            ? currentFilteringState.isFilteringEnabled
            : true;
        if (isFilteringEnabled) {
            await actions.setIconEnabled(tab.id);
        } else {
            await actions.setIconDisabled(tab.id);
        }
    };
}

export default new Icon();
