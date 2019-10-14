import React from 'react';
// import { observer } from 'mobx-react';
import './header.pcss';
// import rootStore from '../../stores';

const Header = () => (
    <div className="widget-popup__header">
        <div className="widget-popup__header-logo" />
        <div className="widget-popup__header-btns" id="popup-header-buttons">
            <span className="widget-popup__header-title">Assistant</span>
            <button
                i18n-title="context_disable_protection"
                className="cir-btn pause changeProtectionStateDisable"
                title="Pause AdGuard protection"
            >
                <img src="../../../assets/images/icon-pause.svg" alt="" />
            </button>
            <button
                i18n-title="context_enable_protection"
                className="cir-btn start changeProtectionStateEnable"
                title="Resume AdGuard protection"
            >
                <img src="../../../assets/images/icon-start.svg" alt="" />
            </button>
            <button
                i18n-title="options_settings"
                className="cir-btn settings openSettings"
                title="AdGuard Settings"
            >
                <img src="../../../assets/images/icon-settings.svg" alt="" />
            </button>
        </div>
    </div>
);

Header.defaultProps = {
    authenticated: false,
};

export default Header;
