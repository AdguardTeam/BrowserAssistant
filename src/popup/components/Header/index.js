import React from 'react';
import './header.pcss';

const Header = () => (
    <div className="widget-popup__header">
        <div className="widget-popup__header-logo"/>
        <div className="widget-popup__header-btns">
            <span className="widget-popup__header-title">Assistant</span>
            <button
                className="cir-btn"
                title="Pause AdGuard protection"
            >
                <img src="../../../assets/images/icon-pause.svg" alt=""/>
            </button>
            <button
                className="cir-btn"
                title="Resume AdGuard protection"
            >
                <img src="../../../assets/images/icon-start.svg" alt=""/>
            </button>
            <button
                className="cir-btn"
                title="AdGuard Settings"
            >
                <img src="../../../assets/images/icon-settings.svg" alt=""/>
            </button>
        </div>
    </div>
);

export default Header;
