import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Option from './Option';
import rootStore from '../../stores';

const getOptions = (stores) => {
    const {
        settingsStore: {
            isFilteringEnabled,
            pageProtocol,
            isAuthorized,
        },
        requestsStore: {
            startBlockingAd,
            openFilteringLog,
            reportSite,
            removeCustomRules,
            getCurrentFilteringState,
        },
        uiStore: {
            isPageFilteredByUserFilter,
        },
        translationStore: {
            translate,
        },
    } = stores;

    return ([
        {
            iconName: 'block-ad',
            text: translate('block_ads'),
            onClick: startBlockingAd,
            isDisabled: !isFilteringEnabled || pageProtocol.isSecured,
            isVisible: true,
        },
        {
            iconName: 'sandwich',
            text: translate('open_filtering_log'),
            onClick: openFilteringLog,
            isDisabled: false,
            isVisible: true,
        },
        {
            iconName: 'thumb-down',
            text: translate('report_site'),
            onClick: reportSite,
            isDisabled: !isFilteringEnabled || pageProtocol.isSecured,
            isVisible: true,
        },
        {
            iconName: 'icon-cross',
            text: translate('reset_custom_rules'),
            onClick: async () => {
                if (!isAuthorized) {
                    return;
                }
                await removeCustomRules();
                await getCurrentFilteringState();
            },
            isDisabled: !isAuthorized,
            isVisible: isPageFilteredByUserFilter,
        },
    ]);
};

const Options = observer(() => {
    const stores = useContext(rootStore);
    const options = getOptions(stores);

    return (
        <div className="actions">
            {options.map(({
                iconName, text, onClick, isDisabled, isVisible,
            }) => (
                isVisible && (
                    <Option
                        key={iconName}
                        iconName={iconName}
                        text={text}
                        onClick={onClick}
                        isDisabled={isDisabled}
                        tabIndex={stores.uiStore.globalTabIndex}
                    />
                )
            ))}
        </div>
    );
});

export default Options;
