import React, { useState } from 'react';
import classNames from 'classnames';
import './header.pcss';

const Header = ({ appState, changeAppState }) => {
    const [isPaused, pause] = useState(true);
    const toggleIcon = () => {
        changeAppState({ ...appState, isProtectionEnabled: !appState.isProtectionEnabled });
        console.log('appState in Header', appState);
        console.log('setProtectionStatus');
        adguard.requests.setProtectionStatus();
        pause(!isPaused);
    };
    const openSetting = () => {
        console.log('openSettings');
        adguard.requests.openSettings();
    };

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
                    title="AdGuard Protection"
                    type="button"
                    onClick={toggleIcon}
                />
                <button
                    className="widget-popup__buttons widget-popup__buttons--settings"
                    title="AdGuard Settings"
                    type="button"
                    onClick={openSetting}
                />
            </div>
        </div>
    );
};

export default Header;
