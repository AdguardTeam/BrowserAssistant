import React from 'react';
import './settings.pcss';
import GlobalSwitcher from './GlobalSwitcher';

const Settings = ({ isPageSecured, isHttpsFilteringEnabled, isDisabled }) => (
    <div className="settings">
        <div className="settings__main">
            <GlobalSwitcher
                id="global-switcher"
                isPageSecured={isPageSecured}
                isDefaultText
                isHttpsFilteringEnabled={isHttpsFilteringEnabled}
                isDisabled={isDisabled}
            />
        </div>
    </div>
);

export default Settings;
