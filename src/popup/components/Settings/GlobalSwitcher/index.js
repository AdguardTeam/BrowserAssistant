import React, { useContext } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import './global-switcher.pcss';
import rootStore from '../../../stores';

const GlobalSwitcher = observer(({
    text, id, isDefaultText,
}) => {
    const { settingsStore } = useContext(rootStore);
    const handleFiltering = () => {
        console.log('setFilteringStatus');
        if (!settingsStore.isPageSecured) {
            settingsStore
                .setFiltering(!settingsStore.isFilteringEnabled);
        }
        return adguard.requests.setFilteringStatus({
            url: settingsStore.currentURL,
            isEnabled: settingsStore.isFilteringEnabled,
            isHttpsEnabled: settingsStore.isHttpsFilteringEnabled,
        });
    };
    const handleHttpsFiltering = () => {
        console.log('setFilteringStatus');
        settingsStore.setHttpsFiltering(!settingsStore.isHttpsFilteringEnabled);
        return adguard.requests.setFilteringStatus({
            url: settingsStore.currentURL,
            isEnabled: settingsStore.isFilteringEnabled,
            isHttpsEnabled: settingsStore.isHttpsFilteringEnabled,
        });
    };

    const switcherTextClass = classNames({
        'global-switcher__text': true,
        'global-switcher__text--secured': settingsStore.isPageSecured,
    });

    const switcherLabelClass = classNames({
        'global-switcher__label': true,
        'global-switcher__label--secured': settingsStore.isPageSecured,
        'global-switcher__label--disabled': !settingsStore.isFilteringEnabled,
    });

    const renderText = () => {
        const defaultText = `${settingsStore.isFilteringEnabled || settingsStore.isPageSecured ? 'Enabled' : 'Disabled'} on this website`;
        return isDefaultText ? defaultText : text;
    };

    return (
        <div className="global-switcher">
            <input
                className="global-switcher__checkbox"
                type="checkbox"
                id={id}
                readOnly
                checked={id === 'global-switcher' ? settingsStore.isFilteringEnabled : settingsStore.isHttpsFilteringEnabled}
            />
            <div className={switcherTextClass}>
                {renderText()}
            </div>
            <label
                className={switcherLabelClass}
                htmlFor={id}
                onClick={id === 'global-switcher' ? handleFiltering : handleHttpsFiltering}
            />
        </div>
    );
});

export default GlobalSwitcher;
