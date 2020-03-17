import { createContext } from 'react';
import { configure } from 'mobx';

import SettingsStore from './settingsStore';
import UiStore from './uiStore';
import RequestsStore from './requestsStore';
import TranslationStore from './translationStore';

// Do not allow property change outside of store actions
configure({ enforceActions: 'observed' });

class RootStore {
    constructor() {
        this.uiStore = new UiStore(this);
        this.settingsStore = new SettingsStore(this);
        this.requestsStore = new RequestsStore(this);
        this.translationStore = new TranslationStore(this);
    }
}

export default createContext(new RootStore());
