import React from 'react';

import './global-switcher.pcss';

function GlobalSwitcher({ text, id }) {
    return (
        <div className="global-switcher">
            <input
                className="global-switcher__checkbox"
                type="checkbox"
                id={id}
            />
            <div className="global-switcher__text">{text}</div>
            <label
                className="global-switcher__label"
                htmlFor={id}
            />
        </div>
    );
}

export default GlobalSwitcher;
