import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Option } from './Option';
import rootStore from '../../stores';

const Options = observer(() => {
    const {
        settingsStore,
        uiStore,
        translationStore,
    } = useContext(rootStore);

    const {
        isFilteringEnabled,
        pageProtocol,
        isAuthorized,
        isPageFilteredByUserFilter,
        isFilteringPauseSupported,
        pauseFiltering,
    } = settingsStore;

    const isDisabled = !isFilteringEnabled || pageProtocol.isSecured || !isAuthorized;

    const buttons = [
        {
            iconName: 'block-ad',
            text: translationStore.translate('block_ads'),
            onClick: settingsStore.initAssistant,
            isDisabled,
            isVisible: true,
        },
        {
            iconName: 'sandwich',
            text: translationStore.translate('open_filtering_log'),
            onClick: settingsStore.openFilteringLog,
            isDisabled: false,
            isVisible: true,
        },
        {
            iconName: 'thumb-down',
            text: translationStore.translate('report_site'),
            onClick: settingsStore.reportSite,
            isDisabled,
            isVisible: true,
        },
        {
            iconName: 'icon-cross',
            text: translationStore.translate('reset_custom_rules'),
            onClick: async () => {
                if (!isAuthorized) {
                    return;
                }
                await settingsStore.removeCustomRules();

                /**
                 *  Extension loses activeTab permission after page reload in Firefox,
                 *  so user should open popup to allow content script injection.
                 *  https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/permissions#activetab_permission
                 */
                window.close();
            },
            isDisabled: !isAuthorized,
            isVisible: isPageFilteredByUserFilter,
        },
    ];

    if (isFilteringPauseSupported) {
        buttons.unshift({
            iconName: 'clock',
            text: translationStore.translate('pause_filtering'),
            onClick: pauseFiltering,
            isDisabled,
            isVisible: true,
        });
    }

    return (
        <div className="actions">
            {buttons.map(({
                iconName, text, onClick, isDisabled, isVisible,
            }) => (
                isVisible && (
                    <Option
                        key={iconName}
                        iconName={iconName}
                        text={text}
                        onClick={onClick}
                        isDisabled={isDisabled}
                        tabIndex={uiStore.globalTabIndex}
                    />
                )
            ))}
        </div>
    );
});

export default Options;
