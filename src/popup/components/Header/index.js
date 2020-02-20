import React, { useContext } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import rootStore from '../../stores';
import translator from '../../../lib/translator';
import './header.pcss';

const Header = observer(() => {
    const {
        settingsStore: {
            isProtectionEnabled,
        },
        requestsStore: {
            openSettings,
            setProtectionStatus,
        },
        uiStore: {
            closePopupWrapper,
            setProtectionTogglePending,
            isProtectionTogglePending,
            isAppWorking,
            requestStatus,
            globalTabIndex,
        },
    } = useContext(rootStore);

    const disableProtection = (e) => {
        setProtectionTogglePending(true);
        setProtectionStatus(false);
        e.target.blur();
    };

    const openSettingsAndClosePopup = closePopupWrapper(openSettings);

    const iconProtectionClass = classNames({
        'widget-popup__buttons': true,
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
                {/* TODO: [object Object] */}
                <button
                    className={iconProtectionClass}
                    title={translator.translate('adg_protection')}
                    aria-label={translator.translate('adg_protection')}
                    type="button"
                    onClick={disableProtection}
                    tabIndex={globalTabIndex}
                />
                <button
                    className={iconSettingsClass}
                    title={translator.translate('adg_settings')}
                    aria-label={translator.translate('adg_settings')}
                    type="button"
                    onClick={openSettingsAndClosePopup}
                    tabIndex={globalTabIndex}
                />
            </div>
        </div>
    );
});

export default Header;
