import throttle from 'lodash/throttle';

import actions from './actions';
import state from './state';
import notifier from '../lib/notifier';
import { tabs } from '../lib/tabs';
import { ContextMenu } from './contextMenu';

/**
 * This class handles browser action icon updates
 */
class Icon {
    constructor() {
        // If updates of icon happen too often ignore them
        const ICON_THROTTLE_TIMEOUT_MS = 50;
        const throttledUpdater = throttle(async (tab) => {
            if (tab) {
                await this.updateIcon(tab);
            }
            // There may be opened more than one window opened
            const activeTabs = await tabs.getActiveTabs();
            activeTabs.forEach((tab) => {
                this.updateIcon(tab);
            });
        }, ICON_THROTTLE_TIMEOUT_MS);

        // Subscribe to events after which icon should update
        notifier.addSpecifiedListener(notifier.types.TAB_ACTIVATED, throttledUpdater);
        notifier.addSpecifiedListener(notifier.types.TAB_UPDATED, throttledUpdater);
        notifier.addSpecifiedListener(notifier.types.STATE_UPDATED, throttledUpdater);
    }

    /**
     * Updates icon according to the current app and tab state
     * @param tab
     * @returns {Promise<void>}
     */
    updateIcon = async (tab) => {
        if (!state.isAppWorking()) {
            await actions.setIconDisabled(tab.id);
            await ContextMenu.update();
            return;
        }

        const currentFilteringState = await state.getCurrentFilteringState(tab);
        await ContextMenu.update();

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
