import React from 'react';
import Option from './Option';
import './options.pcss';

const OPTIONS = [
    {
        iconName: 'block-ad',
        text: 'Block ads\u00A0on\u00A0this website',
    },
    {
        iconName: 'sandwich',
        text: 'Open the filtering log',
    },
    {
        iconName: 'thumb-down',
        text: 'Report\u00A0this website',
    },
    {
        iconName: 'icon-cross',
        text: 'Reset all custom rules for this page',
    },
];

const Options = ({ isPageSecured, isDisabled, isChanged }) => (
    <div className="actions">
        {OPTIONS.slice(0, isChanged ? OPTIONS.length : -1).map(({ iconName, text }, i) => (
            <Option
                key={iconName}
                iconName={iconName}
                text={text}
                isDisabled={(i === 0 || i === 2) && isDisabled && isPageSecured}
            />
        ))}
    </div>
);


export default Options;
