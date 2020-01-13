import React, { useContext } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { useIntl } from 'react-intl';
import rootStore from '../../stores';
import './header.pcss';

const Header = observer(() => {
    const { settingsStore, requestsStore, uiStore } = useContext(rootStore);
    const { formatMessage: f } = useIntl();

    const disableProtection = (e) => {
        uiStore.setProtectionTogglePending(true);
        requestsStore.setProtectionStatus(false);
        e.target.blur();
    };
    const openSetting = () => {
        requestsStore.openSettings();
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
                <div className="widget-popup__header-title">{f({ id: 'assistant' })}</div>
            </div>
            <div className="widget-popup__header-buttons" id="popup-header-buttons">
                <button
                    className={iconProtectionClass}
                    title={f({ id: 'adg_protection' })}
                    type="button"
                    onClick={disableProtection}
                    tabIndex={uiStore.globalTabIndex}
                />
                <button
                    className={iconSettingsClass}
                    title={f({ id: 'adg_settings' })}
                    type="button"
                    onClick={openSetting}
                    tabIndex={uiStore.globalTabIndex}
                />
            </div>
        </div>
    );
});

export default Header;
