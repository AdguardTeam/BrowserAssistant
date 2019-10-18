import React, { useState } from 'react';
import classNames from 'classnames';
import './header.pcss';

const Header = () => {
    const [isPaused, pause] = useState(true);
    const toggleIcon = () => pause(!isPaused);

    const iconClass = classNames({
        'widget-popup__buttons': true,
        'widget-popup__buttons--pause': isPaused,
        'widget-popup__buttons--start': !isPaused,
    });

    return (
        <div className="widget-popup__header">
            <div className="widget-popup__header-logo" />
            <div className="widget-popup__header-buttons" id="popup-header-buttons">
                <span className="widget-popup__header-title">Assistant</span>
                <button
                    className={iconClass}
                    title="AdGuard protection"
                    type="button"
                    onClick={toggleIcon}
                />
                <button
                    className="widget-popup__buttons widget-popup__buttons--settings"
                    title="AdGuard Settings"
                    type="button"
                />
            </div>
        </div>
    );
};

export default Header;
