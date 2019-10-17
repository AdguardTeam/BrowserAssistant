import React, { useState } from 'react';
import classNames from 'classnames';
import './header.pcss';

const Header = () => {
    const [isPaused, pause] = useState(true);
    const iconClass = classNames({
        pause: isPaused,
        start: !isPaused,
    });
    return (
        <div className="widget-popup__header">
            <div className="widget-popup__header-logo" />
            <div className="widget-popup__header-buttons" id="popup-header-buttons">
                <span className="widget-popup__header-title">Assistant</span>
                <button
                    className="cir-btn"
                    title="Pause AdGuard protection"
                    type="button"
                    onClick={() => pause(!isPaused)}
                >
                    <img src={`../../../assets/images/icon-${iconClass}.svg`} alt="" />
                </button>
                <button
                    className="cir-btn settings"
                    title="AdGuard Settings"
                    type="button"
                >
                    <img src="../../../assets/images/icon-settings.svg" alt="" />
                </button>
            </div>
        </div>
    );
};

export default Header;
