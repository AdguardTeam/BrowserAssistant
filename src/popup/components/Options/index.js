import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Option from './Option';
import rootStore from '../../stores';
import './options.pcss';

const Options = observer(() => {
    const { settingsStore, uiStore, requestsStore } = useContext(rootStore);
    const OPTIONS = [
        {
            iconName: 'block-ad',
            text: 'Block ads\u00A0on\u00A0this website',
            handleClick: () => {
                requestsStore.enableBlockingMode();
            },
        },
        {
            iconName: 'sandwich',
            text: 'Open the filtering log',
            handleClick: () => {
                requestsStore.openFilteringLog();
            },
        },
        {
            iconName: 'thumb-down',
            text: 'Report\u00A0this website',
            handleClick: () => {
                requestsStore.reportSite();
            },
        },
        {
            iconName: 'icon-cross',
            text: 'Reset all custom rules for this page',
            handleClick: () => {
                requestsStore.removeCustomRules();
            },
        },
    ];
    return (
        <div className="actions">
            {OPTIONS.slice(0, uiStore.isPageChanged ? OPTIONS.length : -1)
                .map(({ iconName, text, handleClick }) => (
                    <Option
                        key={iconName}
                        iconName={iconName}
                        text={text}
                        isFilteringEnabled={(iconName === 'block-ad' || iconName === 'thumb-down' || iconName === 'icon-cross')
                        && settingsStore.isFilteringEnabled && settingsStore.isPageSecured}
                        handleClick={handleClick}
                    />
                ))}
        </div>
    );
});

export default Options;
