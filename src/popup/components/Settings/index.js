import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import './settings.pcss';
import Switcher from './Switcher';
import rootStore from '../../stores';

const Settings = observer(() => {
    const { settingsStore } = useContext(rootStore);
    const handleFiltering = () => {
        settingsStore.setFiltering(!settingsStore.isFilteringEnabled);
    };
    return (
        <div className="settings">
            <div className="settings__main">
                <Switcher
                    id="global-switcher"
                    checked={settingsStore.isPageSecured ? false : settingsStore.isFilteringEnabled}
                    onClick={!settingsStore.isPageSecured ? handleFiltering : undefined}
                    isPageSecured={settingsStore.isPageSecured}
                    isFilteringEnabled={settingsStore.isFilteringEnabled}
                    isHttps={settingsStore.isHttps}
                />
            </div>
        </div>
    );
});

export default Settings;
