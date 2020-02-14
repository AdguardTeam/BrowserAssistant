import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Option from './Option';
import rootStore from '../../stores';
import translator from '../../../lib/translator';

const getOptions = (stores) => {
    const {
        settingsStore: {
            isFilteringEnabled,
            pageProtocol,
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
            closePopupAfterInvokingFn,
        },
    } = stores;

    return ([
        {
            iconName: 'block-ad',
            text: translator.translate('block_ads'),
            onClick: startBlockingAd,
            isDisabled: !isFilteringEnabled || pageProtocol.isSecured,
            isVisible: true,
        },
        {
            iconName: 'sandwich',
            text: translator.translate('open_filtering_log'),
            onClick: closePopupAfterInvokingFn(openFilteringLog),
            isDisabled: false,
            isVisible: true,
        },
        {
            iconName: 'thumb-down',
            text: translator.translate('report_site'),
            onClick: closePopupAfterInvokingFn(reportSite),
            isDisabled: !isFilteringEnabled || pageProtocol.isSecured,
            isVisible: true,
        },
        {
            iconName: 'icon-cross',
            text: translator.translate('reset_custom_rules'),
            onClick: async () => {
                await removeCustomRules();
                await getCurrentFilteringState();
            },
            isDisabled: false,
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
