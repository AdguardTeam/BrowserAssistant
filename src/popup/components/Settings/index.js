import React from 'react';

import './settings.pcss';

import GlobalSwitcher from './GlobalSwitcher';

const Settings = () => (
    <div className="settings">
        <div className="settings__main">
            <GlobalSwitcher />
        </div>
    </div>
);

export default Settings;
