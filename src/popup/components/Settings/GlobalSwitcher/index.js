import React from 'react';
import classNames from 'classnames';
import './global-switcher.pcss';

function GlobalSwitcher({ text, id, isSecure }) {
    const switcherTextCSSName = 'global-switcher__text';
    const switcherTextClass = classNames({
        [switcherTextCSSName]: true,
        [`${switcherTextCSSName}--secure`]: isSecure,
    });
    const switcherLabelCSSName = 'global-switcher__label';
    const switcherLabelClass = classNames({
        [switcherLabelCSSName]: true,
        [`${switcherLabelCSSName}--secure`]: isSecure,
    });
    return (
        <div className="global-switcher">
            <input
                className="global-switcher__checkbox"
                type="checkbox"
                id={id}
            />
            {text && <div className={switcherTextClass}>{text}</div>}
            <label
                className={switcherLabelClass}
                htmlFor={id}
            />
        </div>
    );
}

export default GlobalSwitcher;
