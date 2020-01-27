import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Option from './Option';
import rootStore from '../../stores';
import translator from '../../../lib/translator';

const getOptions = ({ uiStore, requestsStore, settingsStore }) => ([
    {
        iconName: 'block-ad',
        text: translator.translate('block_ads'),
        onClick: () => {
            requestsStore.startBlockingAd();
        },
        isDisabled: !settingsStore.isFilteringEnabled || settingsStore.isPageSecured,
        isVisible: true,
    },
    {
        iconName: 'sandwich',
        text: translator.translate('open_filtering_log'),
        onClick: () => {
            requestsStore.openFilteringLog();
        },
        isDisabled: false,
        isVisible: true,
    },
    {
        iconName: 'thumb-down',
        text: translator.translate('report_site'),
        onClick: () => {
            requestsStore.reportSite();
        },
        isDisabled: !settingsStore.isFilteringEnabled || settingsStore.isPageSecured,
        isVisible: true,
    },
    {
        iconName: 'icon-cross',
        text: translator.translate('reset_custom_rules'),
        onClick: async () => {
            await requestsStore.removeCustomRules();
            await requestsStore.getCurrentFilteringState();
        },
        isDisabled: false,
        isVisible: uiStore.isPageFilteredByUserFilter,
    },
]);

const Options = observer(() => {
    const stores = useContext(rootStore);
    const { uiStore } = stores;
    const OPTIONS = getOptions(stores);

    return (
        <div className="actions">
            {OPTIONS.map(({
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
