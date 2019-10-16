import React, { useState } from 'react';
import './settings.pcss';

import GlobalSwitcher from './GlobalSwitcher';

const Settings = ({ isSecure }) => {
    const [isEnabled, toggleEnable] = useState(false);
    const handleEnable = () => toggleEnable(!isEnabled);
    return (
        <div className="settings">
            <div className="settings__main">
                {/*onMouseUp={handleEnable}*/}
                <GlobalSwitcher text={`${isEnabled ? 'Enabled' : 'Disabled'} on this website`} id="global-switcher" isSecure={isSecure} />
            </div>
        </div>
    );
};

export default Settings;
