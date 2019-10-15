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

// OPTIONS.pop()

const Options = () => (
    <div className="actions">
        {OPTIONS.map(({ iconName, text }) => (
            <Option key={iconName} iconName={iconName} text={text} />))}
    </div>
);


export default Options;
