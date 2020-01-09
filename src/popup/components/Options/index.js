import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Option from './Option';
import rootStore from '../../stores';

const Options = observer(() => {
    const { uiStore, requestsStore, settingsStore } = useContext(rootStore);
    const OPTIONS = [
        {
            iconName: 'block-ad',
            text: 'Block ads\u00A0on\u00A0this website',
            onClick: () => {
                requestsStore.startBlockingAd();
            },
            isDisabled: !settingsStore.isFilteringEnabled || settingsStore.isPageSecured,
            isDisplayed: true,
        },
        {
            iconName: 'sandwich',
            text: 'Open the filtering log',
            onClick: () => {
                requestsStore.openFilteringLog();
            },
            isDisabled: false,
            isDisplayed: true,
        },
        {
            iconName: 'thumb-down',
            text: 'Report\u00A0this website',
            onClick: () => {
                requestsStore.reportSite();
            },
            isDisabled: !settingsStore.isFilteringEnabled || settingsStore.isPageSecured,
            isDisplayed: true,
        },
        {
            iconName: 'icon-cross',
            text: 'Reset all custom rules for this page',
            onClick: async () => {
                await requestsStore.removeCustomRules();
                await requestsStore.getCurrentFilteringState();
            },
            isDisabled: false,
            isDisplayed: uiStore.isPageFilteredByUserFilter,
        },
    ];
    return (
        <div className="actions">
            {OPTIONS
                .map(({
                    iconName, text, onClick, isDisabled, isDisplayed,
                }) => (
                    isDisplayed && (
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
