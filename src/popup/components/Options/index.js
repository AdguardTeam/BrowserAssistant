import React from 'react';
import Option from './Option';
import './options.pcss';

const OPTIONS = [
    {
        iconName: 'block-ad',
        text: 'Block ads\u00A0on\u00A0this website',
        handleClick: () => {
            console.log('addRule');
            console.log('removeRule');
            adguard.requests.addRule();
            adguard.requests.removeRule();
        },
    },
    {
        iconName: 'sandwich',
        text: 'Open the filtering log',
        handleClick: () => {
            console.log('openFilteringLog');
            adguard.requests.openFilteringLog();
        },
    },
    {
        iconName: 'thumb-down',
        text: 'Report\u00A0this website',
        handleClick: () => {
            console.log('reportSite');
            adguard.requests.reportSite();
        },
    },
    {
        iconName: 'icon-cross',
        text: 'Reset all custom rules for this page',
        handleClick: () => {
            console.log('removeCustomRules');
            adguard.requests.removeCustomRules();
        },
    },
];

const Options = ({ isPageSecured, isFilteringEnabled, isChanged }) => (
    <div className="actions">
        {OPTIONS.slice(0, isChanged ? OPTIONS.length : -1)
            .map(({ iconName, text, handleClick }, i) => (
                <Option
                    key={iconName}
                    iconName={iconName}
                    text={text}
                    isFilteringEnabled={(i === 0 || i === 2) && isFilteringEnabled && isPageSecured}
                    handleClick={handleClick}
                />
            ))}
    </div>
);


export default Options;
