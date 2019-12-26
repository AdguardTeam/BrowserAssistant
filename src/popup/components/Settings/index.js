import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import './settings.pcss';
import Switcher from './Switcher';
import rootStore from '../../stores';
import { SWITCHER_IDS } from '../../stores/consts';

const Settings = observer(() => {
    const { settingsStore, uiStore } = useContext(rootStore);
    const toggleFiltering = () => {
        settingsStore.setFiltering(!settingsStore.isFilteringEnabled);
    };
    return (
        <div className="settings">
            <div className="settings__main">
                <Switcher
                    id={SWITCHER_IDS.GLOBAL_SWITCHER}
                    checked={settingsStore.isPageSecured ? false : settingsStore.isFilteringEnabled}
                    onClick={!settingsStore.isPageSecured ? toggleFiltering : undefined}
                    isPageSecured={settingsStore.isPageSecured}
                    isFilteringEnabled={settingsStore.isFilteringEnabled}
                    isHttps={settingsStore.isHttps}
                    tabIndex={uiStore.globalTabIndex}
                />
            </div>
        </div>
    );
});

export default Settings;
