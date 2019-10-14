import React from 'react';
import Option from "./Option"
import './options.pcss';

const OPTIONS = [
    {
        name: 'block-ad',
        text: 'Block ads\u00A0on\u00A0this website'
    },
    {
        name: 'sandwich',
        text: 'Open the filtering log',
    },
    {
        name: 'thumb-down',
        text: 'Report\u00A0this website',
    },
    {
        name: 'icon-cross',
        text: 'Reset all custom rules for this page',
    }
]

const Options = () =>
    <div className="actions">
        {OPTIONS.map(({name, text}) => (
            <Option name={name} text={text}/>))}
    </div>


export default Options;
