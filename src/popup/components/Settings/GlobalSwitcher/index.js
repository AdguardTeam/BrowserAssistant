import React from 'react';

import './global-switcher.pcss';

function GlobalSwitcher() {
    return (
        <div className="global-switcher">
            <input
                className="global-switcher__checkbox"
                type="checkbox"
                id="global-switcher"
            />
            <div className="global-switcher__text">Enabled on this website</div>
            <label
                className="global-switcher__label"
                htmlFor="global-switcher"
            />
        </div>
    );
}

export default GlobalSwitcher;
