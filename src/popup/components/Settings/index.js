import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import './settings.pcss';
import classNames from 'classnames';
import Switcher from './Switcher';
import rootStore from '../../stores';
import { SWITCHER_IDS } from '../../stores/consts';

const Settings = observer(() => {
    const { settingsStore, uiStore } = useContext(rootStore);
    const { isFilteringEnabled, isPageSecured } = settingsStore;
    const toggleFiltering = () => {
        settingsStore.setFiltering(!isFilteringEnabled);
    };
    const onClick = () => {
        if (settingsStore.isPageSecured) {
            return;
        }
        toggleFiltering();
    };
    const settingClass = classNames({
        settings: true,
        'settings--short': uiStore.isPageFilteredByUserFilter,
    });

    return (
        <div className={settingClass}>
            <div className="settings__main">
                <Switcher
                    id={SWITCHER_IDS.GLOBAL_SWITCHER}
                    checked={isPageSecured ? true : isFilteringEnabled}
                    onClick={onClick}
                    isPageSecured={isPageSecured}
                    isDisabled={isPageSecured}
                    tabIndex={uiStore.globalTabIndex}
                />
            </div>
            <hr className="horizontal-line" />
        </div>
    );
});

export default Settings;
