import React, { useState } from 'react';
import classNames from 'classnames';
import './global-switcher.pcss';


const GlobalSwitcher = ({
    text, id, isPageSecured, isDefaultText,
}) => {
    const [isFilteringEnabled, toggleFiltering] = useState(false);
    const handleFiltering = () => toggleFiltering(!isFilteringEnabled);

    const switcherTextClass = classNames({
        'global-switcher__text': true,
        'global-switcher__text--secured': isPageSecured,
    });

    const switcherLabelClass = classNames({
        'global-switcher__label': true,
        'global-switcher__label--secured': isPageSecured,
    });

    const renderText = () => {
        const defaultText = `${isFilteringEnabled ? 'Enabled' : 'Disabled'} on this website`;
        return isDefaultText ? defaultText : text;
    };

    return (
        <div className="global-switcher">
            <input
                className="global-switcher__checkbox"
                type="checkbox"
                id={id}
            />
            <div className={switcherTextClass}>
                {renderText()}
            </div>
            <label
                className={switcherLabelClass}
                htmlFor={id}
                onClick={handleFiltering}
            />
        </div>
    );
};

export default GlobalSwitcher;
