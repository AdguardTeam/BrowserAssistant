import React from 'react';
import './settings.pcss';

import GlobalSwitcher from './GlobalSwitcher';

const Settings = ({ isTrusted }) => (
    <div className="settings">
        <div className="settings__main">
            <GlobalSwitcher id="global-switcher" isTrusted={isTrusted} isControllable />
        </div>
    </div>
);

export default Settings;
