import React, { useContext } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import rootStore from '../../stores';
import './header.pcss';

const Header = observer(() => {
    const { settingsStore, requestsStore, uiStore } = useContext(rootStore);
    const disableProtection = () => {
        uiStore.setPendingToggleProtection(true);
        requestsStore.setProtectionStatus(false);
    };
    const openSetting = () => {
        requestsStore.openSettings();
    };

    const iconProtectionClass = classNames({
        'widget-popup__buttons': true,
        'widget-popup__buttons--pause': settingsStore.isProtectionEnabled,
        'widget-popup__buttons--start': !settingsStore.isProtectionEnabled || uiStore.isPendingToggleProtection,
        'widget-popup__buttons--hidden': !uiStore.isAppWorking,
    });

    const iconSettingsClass = classNames({
        'widget-popup__buttons': true,
        'widget-popup__buttons--settings': true,
        'widget-popup__buttons--hidden': !uiStore.isAppWorking,
    });

    return (
        <div className="widget-popup__header">
            <div className="widget-popup__header-container">
                <div className="widget-popup__header-logo" />
                <div className="widget-popup__header-title">Assistant</div>
            </div>
            <div className="widget-popup__header-buttons" id="popup-header-buttons">
                <button
                    className={iconProtectionClass}
                    title="AdGuard Protection"
                    type="button"
                    onClick={disableProtection}
                    tabIndex="0"
                />
                <button
                    className={iconSettingsClass}
                    title="AdGuard Settings"
                    type="button"
                    onClick={openSetting}
                    tabIndex="0"
                />
            </div>
        </div>
    );
});

export default Header;
