import React from 'react';

import './settings.pcss';

import GlobalSwitcher from './GlobalSwitcher';

const Settings = () => (
    <div className="settings">
        <div className="settings__main">
            <GlobalSwitcher text="Enabled on this website" id="global-switcher" />
        </div>
    </div>
);

export default Settings;
