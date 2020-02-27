import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Switcher from './Switcher';
import rootStore from '../../stores';
import { SWITCHER_IDS } from '../../stores/consts';
import './settings.pcss';

const Settings = observer(() => {
    const {
        settingsStore: {
            isFilteringEnabled, pageProtocol, setFiltering,
        },
        translationStore: { translate },
        uiStore: { globalTabIndex },
    } = useContext(rootStore);

    const toggleFiltering = () => {
        setFiltering(!isFilteringEnabled);
    };

    const onClick = () => {
        if (pageProtocol.isSecured) {
            return;
        }
        toggleFiltering();
    };

    const checked = pageProtocol.isSecured ? true : isFilteringEnabled;

    return (
        <div className="settings">
            <div className="settings__main">
                <Switcher
                    id={SWITCHER_IDS.GLOBAL_SWITCHER}
                    checked={checked}
                    onClick={onClick}
                    isSecured={pageProtocol.isSecured}
                    isDisabled={pageProtocol.isSecured}
                    tabIndex={globalTabIndex}
                    label={translate(checked ? 'enabled' : 'disabled')}
                />
            </div>
            <hr className="horizontal-line" />
        </div>
    );
});

export default Settings;
