import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Option from './Option';
import rootStore from '../../stores';

const getOptions = (stores) => {
    const {
        settingsStore: {
            isFilteringEnabled,
            isPageSecured,
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
    } = stores;

    return ([
        {
            iconName: 'block-ad',
            text: 'Block ads\u00A0on\u00A0this website',
            onClick: startBlockingAd,
            isDisabled: !isFilteringEnabled || isPageSecured,
            isVisible: true,
        },
        {
            iconName: 'sandwich',
            text: 'Open the filtering log',
            onClick: () => {
                openFilteringLog();
                window.close();
            },
            isDisabled: false,
            isVisible: true,
        },
        {
            iconName: 'thumb-down',
            text: 'Report\u00A0this website',
            onClick: reportSite,
            isDisabled: !isFilteringEnabled || isPageSecured,
            isVisible: true,
        },
        {
            iconName: 'icon-cross',
            text: 'Reset all custom rules for this page',
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
