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
        isAppWorking,
    } = settingsStore;

    const {
        isPending,
        globalTabIndex,
    } = uiStore;

    const { translate } = translationStore;

    const disableProtection = async (e) => {
        if (!isAuthorized) {
            return;
        }
        e.persist();
        await setProtectionStatus(false);
        e.target.blur();
    };

    const iconProtectionClass = classNames({
        'widget-popup__buttons': true,
        'widget-popup__buttons--disabled': !isAuthorized,
        'widget-popup__buttons--pause': isProtectionEnabled,
        // start button is displayed during disconnection, in order to create smooth ux
        'widget-popup__buttons--start': isPending,
        'widget-popup__buttons--hidden': !isAppWorking,
    });

    const iconSettingsClass = classNames({
        'widget-popup__buttons': true,
        'widget-popup__buttons--settings': true,
        'widget-popup__buttons--hidden': !isAppWorking,
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
