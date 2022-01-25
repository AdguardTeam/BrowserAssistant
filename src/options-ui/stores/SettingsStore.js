import {
    action,
    makeObservable,
    observable,
    runInAction,
} from 'mobx';
import browser from 'webextension-polyfill';

import { OPTIONS_UI_MESSAGES, SETTINGS } from '../../lib/types';

export class SettingsStore {
    constructor(rootStore) {
        makeObservable(this);
        this.rootStore = rootStore;
    }

    @observable contextEnabled = true;

    @observable settingsReceived = false;

    @action
    async getSettings() {
        this.settingsReceived = false;
        const contextEnabled = await this.getSetting(SETTINGS.CONTEXT_MENU_ENABLED);
        runInAction(() => {
            this.settingsReceived = true;
            this.contextEnabled = contextEnabled;
        });
    }

    @action
    async setContextMenuState(state) {
        await this.setSetting(SETTINGS.CONTEXT_MENU_ENABLED, state);
        runInAction(() => {
            this.contextEnabled = state;
        });
    }

    @action
    async getSetting(key) {
        return browser.runtime.sendMessage({
            type: OPTIONS_UI_MESSAGES.GET_SETTING,
            data: {
                key,
            },
        });
    }

    @action
    async setSetting(key, value) {
        return browser.runtime.sendMessage({
            type: OPTIONS_UI_MESSAGES.SET_SETTING,
            data: {
                key,
                value,
            },
        });
    }
}
