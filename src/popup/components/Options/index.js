import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { useIntl } from 'react-intl';
import Option from './Option';
import rootStore from '../../stores';

const getOptions = ({ uiStore, requestsStore, settingsStore }, f) => ([
    {
        iconName: 'block-ad',
        text: f({ id: 'block_ads' }),
        onClick: () => {
            requestsStore.startBlockingAd();
        },
        isDisabled: !settingsStore.isFilteringEnabled || settingsStore.isPageSecured,
        isVisible: true,
    },
    {
        iconName: 'sandwich',
        text: f({ id: 'open_filtering_log' }),
        onClick: () => {
            requestsStore.openFilteringLog();
        },
        isDisabled: false,
        isVisible: true,
    },
    {
        iconName: 'thumb-down',
        text: f({ id: 'report_site' }),
        onClick: () => {
            requestsStore.reportSite();
        },
        isDisabled: !settingsStore.isFilteringEnabled || settingsStore.isPageSecured,
        isVisible: true,
    },
    {
        iconName: 'icon-cross',
        text: f({ id: 'reset_custom_rules' }),
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
    const { formatMessage: f } = useIntl();
    const OPTIONS = getOptions(stores, f);

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
