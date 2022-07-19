import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Switcher from './Switcher';
import rootStore from '../../stores';
import { SWITCHER_IDS } from '../../stores/consts';
import './settings.pcss';

const Settings = observer(() => {
    const {
        settingsStore: {
            isFilteringEnabled,
            pageProtocol,
            setFiltering,
            isAuthorized,
            canChangeFilteringStatus,
        },
        translationStore: { translate },
        uiStore: { globalTabIndex },
    } = useContext(rootStore);

    const toggleFiltering = () => setFiltering(!isFilteringEnabled);

    const checked = pageProtocol.isSecured ? true : isFilteringEnabled;

    const isDisabled = pageProtocol.isSecured || !isAuthorized || !canChangeFilteringStatus;

    return (
        <div className="settings">
            <div className="settings__main">
                <Switcher
                    id={SWITCHER_IDS.GLOBAL_SWITCHER}
                    checked={checked}
                    onClick={toggleFiltering}
                    isDisabled={isDisabled}
                    tabIndex={globalTabIndex}
                    label={translate(checked ? 'enabled' : 'disabled')}
                    isException={!canChangeFilteringStatus}
                />
            </div>
        </div>
    );
});

export default Settings;
