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
                console.log('addRule');
                console.log('removeRule');
                // TODO: implement rule management logic
                requestsStore.enableBlockingMode();
                // requestsStore.addRule();
                // requestsStore.removeRule();
            },
        },
        {
            iconName: 'sandwich',
            text: 'Open the filtering log',
            handleClick: () => {
                console.log('openFilteringLog');
                requestsStore.openFilteringLog();
            },
        },
        {
            iconName: 'thumb-down',
            text: 'Report\u00A0this website',
            handleClick: () => {
                console.log('reportSite');
                requestsStore.reportSite();
            },
        },
        {
            iconName: 'icon-cross',
            text: 'Reset all custom rules for this page',
            handleClick: () => {
                console.log('removeCustomRules');
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
                        isFilteringEnabled={(iconName === 'block-ad' || iconName === 'thumb-down')
                        && settingsStore.isFilteringEnabled && settingsStore.isPageSecured}
                        handleClick={handleClick}
                    />
                ))}
        </div>
    );
});

export default Options;
