import { createContext } from 'react';
import { configure } from 'mobx';

import { SettingsStore } from './SettingsStore';

// Do not allow property change outside of store actions
configure({ enforceActions: 'observed' });

class OptionsUiStore {
    constructor() {
        this.settingsStore = new SettingsStore(this);
    }
}

export const optionsUiStore = createContext(new OptionsUiStore());
