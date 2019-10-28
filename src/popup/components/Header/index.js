import React, { useContext } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import rootStore from '../../stores';
import './header.pcss';

const Header = observer(() => {
    const { settingsStore, requestsStore } = useContext(rootStore);
    const toggleProtection = () => {
        console.log('setProtectionStatus');
        requestsStore.setProtectionStatus();
        return settingsStore.toggleProtection();
    };
    const openSetting = () => {
        console.log('openSettings');
        requestsStore.openSettings();
    };

    const iconClass = classNames({
        'widget-popup__buttons': true,
        'widget-popup__buttons--pause': settingsStore.isProtectionEnabled,
        'widget-popup__buttons--start': !settingsStore.isProtectionEnabled,
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
                    onClick={toggleProtection}
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
});

export default Header;
