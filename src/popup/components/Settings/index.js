import React from 'react';
import './settings.pcss';

import GlobalSwitcher from './GlobalSwitcher';

const Settings = ({ isPageSecured }) => (
    <div className="settings">
        <div className="settings__main">
            <GlobalSwitcher id="global-switcher" isPageSecured={isPageSecured} isDefaultText />
        </div>
    </div>
);

export default Settings;
