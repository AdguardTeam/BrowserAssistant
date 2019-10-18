import React, { useState } from 'react';
import classNames from 'classnames';
import './global-switcher.pcss';


const GlobalSwitcher = ({
    text, id, isTrusted, isDefaultText,
}) => {
    const [isEnabled, toggleEnable] = useState(false);
    const handleEnable = () => toggleEnable(!isEnabled);

    const switcherTextClass = classNames({
        'global-switcher__text': true,
        'global-switcher__text--trusted': isTrusted,
    });

    const switcherLabelClass = classNames({
        'global-switcher__label': true,
        'global-switcher__label--trusted': isTrusted,
    });

    const renderText = () => {
        return isDefaultText ? `${isEnabled ? 'Enabled' : 'Disabled'} on this website` : text;
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
                onMouseUp={handleEnable}
            />
        </div>
    );
};

export default GlobalSwitcher;
