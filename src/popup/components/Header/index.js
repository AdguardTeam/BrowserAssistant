import React, { useContext } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import rootStore from '../../stores';
import translator from '../../../lib/translator';
import './header.pcss';

const Header = observer(() => {
    const { settingsStore, requestsStore, uiStore } = useContext(rootStore);

    const disableProtection = (e) => {
        uiStore.setProtectionTogglePending(true);
        requestsStore.setProtectionStatus(false);
        e.target.blur();
    };

    const openSetting = () => {
        requestsStore.openSettings();
        window.close();
    };

    const iconProtectionClass = classNames({
        'widget-popup__buttons': true,
        'widget-popup__buttons--pause': settingsStore.isProtectionEnabled,
        'widget-popup__buttons--start': !settingsStore.isProtectionEnabled || uiStore.isProtectionTogglePending,
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
                <div className="widget-popup__header-title">{translator.translate('assistant')}</div>
            </div>
            <div className="widget-popup__header-buttons" id="popup-header-buttons">
                <button
                    className={iconProtectionClass}
                    title={translator.translate('adg_protection')}
                    type="button"
                    onClick={disableProtection}
                    tabIndex={uiStore.globalTabIndex}
                />
                <button
                    className={iconSettingsClass}
                    title={translator.translate('adg_settings')}
                    type="button"
                    onClick={openSetting}
                    tabIndex={uiStore.globalTabIndex}
                />
            </div>
        </div>
    );
});

export default Header;
