import React from 'react';
import classNames from 'classnames';
import './global-switcher.pcss';

const GlobalSwitcher = ({
    text, id, isPageSecured, isDefaultText,
    isFilteringEnabled,
    toggleFiltering, isHttpsFilteringEnabled, toggleHttpsFiltering,
}) => {
    const handleFiltering = () => {
        console.log('setFilteringStatus');
        adguard.requests.setFilteringStatus();
        return !isPageSecured ? toggleFiltering(!isFilteringEnabled) : null;
    };
    const handleHttpsFiltering = () => {
        console.log('setFilteringStatus');
        adguard.requests.setFilteringStatus();
        toggleHttpsFiltering(!isHttpsFilteringEnabled);
    };

    const switcherTextClass = classNames({
        'global-switcher__text': true,
        'global-switcher__text--secured': isPageSecured,
    });

    const switcherLabelClass = classNames({
        'global-switcher__label': true,
        'global-switcher__label--secured': isPageSecured,
        'global-switcher__label--disabled': !isFilteringEnabled,
    });

    const renderText = () => {
        const defaultText = `${isFilteringEnabled || isPageSecured ? 'Enabled' : 'Disabled'} on this website`;
        return isDefaultText ? defaultText : text;
    };

    return (
        <div className="global-switcher">
            <input
                className="global-switcher__checkbox"
                type="checkbox"
                id={id}
                readOnly
                checked={id === 'global-switcher' ? isFilteringEnabled : isHttpsFilteringEnabled}
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
};

export default GlobalSwitcher;
