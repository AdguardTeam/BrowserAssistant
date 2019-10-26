import React from 'react';
import { observer } from 'mobx-react';
import './settings.pcss';
import GlobalSwitcher from './GlobalSwitcher';

const Settings = observer(() => (
    <div className="settings">
        <div className="settings__main">
            <GlobalSwitcher
                id="global-switcher"
                isDefaultText
            />
        </div>
    </div>
))

export default Settings;
