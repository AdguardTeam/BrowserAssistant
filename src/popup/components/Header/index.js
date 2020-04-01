import React, { useContext } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import rootStore from '../../stores';
import './header.pcss';

const Header = observer(() => {
    const {
        settingsStore,
        uiStore,
        translationStore,
    } = useContext(rootStore);

    const {
        isProtectionEnabled,
        isAuthorized,
        setProtectionStatus,
        openSettings,
    } = settingsStore;

    const {
        setProtectionTogglePending,
        isProtectionTogglePending,
        isAppWorking,
        requestStatus,
        globalTabIndex,
    } = uiStore;

    const { translate } = translationStore;

    const disableProtection = async (e) => {
        if (!isAuthorized) {
            return;
        }
        setProtectionTogglePending(true);
        await setProtectionStatus(false);
        e.target.blur();
    };

    const iconProtectionClass = classNames({
        'widget-popup__buttons': true,
        'widget-popup__buttons--disabled': !isAuthorized,
        'widget-popup__buttons--pause': isProtectionEnabled,
        'widget-popup__buttons--start': !isProtectionEnabled || isProtectionTogglePending,
        'widget-popup__buttons--hidden': !isAppWorking || requestStatus.isPending,
    });

    const iconSettingsClass = classNames({
        'widget-popup__buttons': true,
        'widget-popup__buttons--settings': true,
        'widget-popup__buttons--hidden': !isAppWorking || requestStatus.isPending,
    });

    return (
        <div className="widget-popup__header">
            <div className="widget-popup__header-container">
                <div className="widget-popup__header-logo" />
            </div>
            <div className="widget-popup__header-buttons" id="popup-header-buttons">
                <button
                    className={iconProtectionClass}
                    title={translate('adg_protection')}
                    aria-label={translate('adg_protection')}
                    type="button"
                    onClick={disableProtection}
                    tabIndex={globalTabIndex}
                />
                <button
                    className={iconSettingsClass}
                    title={translate('adg_settings')}
                    aria-label={translate('adg_settings')}
                    type="button"
                    onClick={openSettings}
                    tabIndex={globalTabIndex}
                />
            </div>
        </div>
    );
});

export default Header;
