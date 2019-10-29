import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import './settings.pcss';
import Switcher from './Switcher';
import rootStore from '../../stores';


const Settings = observer(() => {
    const { uiStore } = useContext(rootStore);
    return (
        <div className="settings">
            <div className="settings__main">
                <Switcher
                    id="global-switcher"
                    text={uiStore.switcherText}
                />
            </div>
        </div>
    );
});

export default Settings;
