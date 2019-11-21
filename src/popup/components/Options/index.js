import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Option from './Option';
import rootStore from '../../stores';
import './options.pcss';
import { BODY_SIZE_STATUS } from '../../stores/consts';

const Options = observer(() => {
    const { uiStore, requestsStore, settingsStore } = useContext(rootStore);
    const OPTIONS = [
        {
            iconName: 'block-ad',
            text: 'Block ads\u00A0on\u00A0this website',
            handleClick: () => {
                requestsStore.startBlockingAd();
            },
            isDisabled: !settingsStore.isFilteringEnabled || settingsStore.isPageSecured,
        },
        {
            iconName: 'sandwich',
            text: 'Open the filtering log',
            handleClick: () => {
                requestsStore.openFilteringLog();
            },
            isDisabled: false,
        },
        {
            iconName: 'thumb-down',
            text: 'Report\u00A0this website',
            handleClick: () => {
                requestsStore.reportSite();
            },
            isDisabled: !settingsStore.isFilteringEnabled || settingsStore.isPageSecured,
        },
        {
            iconName: 'icon-cross',
            text: 'Reset all custom rules for this page',
            handleClick: () => {
                uiStore.resizeBody(BODY_SIZE_STATUS.NORMAL);
                requestsStore.removeCustomRules();
            },
            isDisabled: false,
        },
    ];
    return (
        <div className="actions">
            {OPTIONS
                .slice(0, uiStore.isPageFilteredByUserFilter ? OPTIONS.length : -1)
                .map(({
                    iconName, text, handleClick, isDisabled,
                }) => (
                    <Option
                        key={iconName}
                        iconName={iconName}
                        text={text}
                        handleClick={handleClick}
                        isDisabled={isDisabled}
                    />
                ))}
        </div>
    );
});

export default Options;
