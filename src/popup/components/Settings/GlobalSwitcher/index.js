import React, { useState } from 'react';
import classNames from 'classnames';
import './global-switcher.pcss';


const GlobalSwitcher = ({
    text, id, isTrusted, isControllable,
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

    return (
        <div className="global-switcher">
            <input
                className="global-switcher__checkbox"
                type="checkbox"
                id={id}
            />
            {!isControllable && text && <div className={switcherTextClass}>{text}</div>}
            {isControllable
            && <div className={switcherTextClass}>{`${isEnabled ? 'Enabled' : 'Disabled'} on this website`}</div>}
            <label
                className={switcherLabelClass}
                htmlFor={id}
                onMouseUp={handleEnable}
            />
        </div>
    );
};

export default GlobalSwitcher;
