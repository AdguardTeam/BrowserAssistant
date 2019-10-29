import React, { useContext } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import './switcher.pcss';
import rootStore from '../../../stores';


const Switcher = observer(({
    text, id,
}) => {
    const { settingsStore, requestsStore } = useContext(rootStore);
    const handleFiltering = () => {
        console.log('setFilteringStatus');
        if (!settingsStore.isPageSecured) {
            settingsStore
                .setFiltering(!settingsStore.isFilteringEnabled);
        }
        return requestsStore.setFilteringStatus();
    };
    const handleHttpsFiltering = () => {
        console.log('setFilteringStatus');
        settingsStore.setHttpsFiltering(!settingsStore.isHttpsFilteringEnabled);
        return requestsStore.setFilteringStatus();
    };

    const switcherTextClass = classNames({
        switcher__text: true,
        'switcher__text--secured': settingsStore.isPageSecured,
    });

    const switcherLabelClass = classNames({
        switcher__label: true,
        'switcher__label--secured': settingsStore.isPageSecured,
        'switcher__label--disabled': !settingsStore.isFilteringEnabled,
    });

    return (
        <div className="switcher">
            <input
                className="switcher__checkbox"
                type="checkbox"
                id={id}
                readOnly
                checked={id === 'switcher' ? settingsStore.isFilteringEnabled : settingsStore.isHttpsFilteringEnabled}
            />
            <div className={switcherTextClass}>
                {text}
            </div>
            <label
                className={switcherLabelClass}
                htmlFor={id}
                onClick={id === 'switcher' ? handleFiltering : handleHttpsFiltering}
            />
        </div>
    );
});

export default Switcher;
