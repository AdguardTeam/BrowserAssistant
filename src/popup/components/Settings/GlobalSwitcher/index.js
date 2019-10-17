import React, { useState } from 'react';
import classNames from 'classnames';
import './global-switcher.pcss';


const GlobalSwitcher = ({
    text, id, isTrusted, isControllable,
}) => {
    const [isEnabled, toggleEnable] = useState(false);
    const handleEnable = () => toggleEnable(!isEnabled);

    const switcherTextCSSName = 'global-switcher__text';
    const switcherTextClass = classNames({
        [switcherTextCSSName]: true,
        [`${switcherTextCSSName}--trusted`]: isTrusted,
    });
    const switcherLabelCSSName = 'global-switcher__label';
    const switcherLabelClass = classNames({
        [switcherLabelCSSName]: true,
        [`${switcherLabelCSSName}--trusted`]: isTrusted,
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
                onMouseUp={() => handleEnable(!isEnabled)}
            />
        </div>
    );
};

export default GlobalSwitcher;
