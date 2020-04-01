import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Option from './Option';
import rootStore from '../../stores';

const Options = observer(() => {
    const {
        settingsStore,
        uiStore,
        translationStore,
    } = useContext(rootStore);

    const { isFilteringEnabled, pageProtocol, isAuthorized } = settingsStore;

    const buttons = [
        {
            iconName: 'block-ad',
            text: translationStore.translate('block_ads'),
            onClick: settingsStore.initAssistant,
            isDisabled: !isFilteringEnabled || pageProtocol.isSecured,
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
            isDisabled: !isFilteringEnabled || pageProtocol.isSecured,
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
            },
            isDisabled: !isAuthorized,
            isVisible: uiStore.isPageFilteredByUserFilter,
        },
    ];

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
