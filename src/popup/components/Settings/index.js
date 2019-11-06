import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import './settings.pcss';
import Switcher from './Switcher';
import rootStore from '../../stores';


const Settings = observer(() => {
    const { uiStore, settingsStore, requestsStore } = useContext(rootStore);
    const handleFiltering = () => {
        if (!settingsStore.isPageSecured) {
            settingsStore
                .setFiltering(!settingsStore.isFilteringEnabled);
        }
        requestsStore.setFilteringStatus();
    };
    return (
        <div className="settings">
            <div className="settings__main">
                <Switcher
                    id="global-switcher"
                    text={uiStore.switcherText}
                    checked={settingsStore.isFilteringEnabled}
                    onClick={handleFiltering}
                    isPageSecured={settingsStore.isPageSecured}
                    isFilteringEnabled={settingsStore.isFilteringEnabled}
                    isHttps={settingsStore.isHttps}
                />
            </div>
        </div>
    );
});

export default Settings;
