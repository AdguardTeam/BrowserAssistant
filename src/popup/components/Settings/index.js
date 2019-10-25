import React from 'react';
import './settings.pcss';
import GlobalSwitcher from './GlobalSwitcher';

const Settings = ({
    isPageSecured,
    isHttpsFilteringEnabled,
    isFilteringEnabled,
    toggleFiltering,
    toggleHttpsFiltering,
}) => (
    <div className="settings">
        <div className="settings__main">
            <GlobalSwitcher
                id="global-switcher"
                isDefaultText
                isPageSecured={isPageSecured}
                isHttpsFilteringEnabled={isHttpsFilteringEnabled}
                isFilteringEnabled={isFilteringEnabled}
                toggleFiltering={toggleFiltering}
                toggleHttpsFiltering={toggleHttpsFiltering}
            />
        </div>
    </div>
);

export default Settings;
