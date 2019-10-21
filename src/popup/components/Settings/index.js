import React from 'react';
import './settings.pcss';

import GlobalSwitcher from './GlobalSwitcher';

const Settings = ({ isSecured }) => (
    <div className="settings">
        <div className="settings__main">
            <GlobalSwitcher id="global-switcher" isSecured={isSecured} isDefaultText />
        </div>
    </div>
);

export default Settings;
