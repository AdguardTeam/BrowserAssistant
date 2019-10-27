import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Option from './Option';
import rootStore from '../../stores';
import './options.pcss';

const Options = observer(() => {
    const { settingsStore, uiStore } = useContext(rootStore);
    const OPTIONS = [
        {
            iconName: 'block-ad',
            text: 'Block ads\u00A0on\u00A0this website',
            handleClick: () => {
                console.log('addRule');
                console.log('removeRule');
                // TODO: implement rule management logic
                adguard.requests.addRule(settingsStore.currentTabHostname);
                adguard.requests.removeRule(settingsStore.currentTabHostname);
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
                // TODO: find out how to define referrer
                adguard.requests.reportSite({ url: settingsStore.currentURL, referrer: 'https://yandex.ru' });
            },
        },
        {
            iconName: 'icon-cross',
            text: 'Reset all custom rules for this page',
            handleClick: () => {
                console.log('removeCustomRules');
                adguard.requests.removeCustomRules(settingsStore.currentURL);
            },
        },
    ];
    return (
        <div className="actions">
            {OPTIONS.slice(0, uiStore.isPageChanged ? OPTIONS.length : -1)
                .map(({ iconName, text, handleClick }, i) => (
                    <Option
                        key={iconName}
                        iconName={iconName}
                        text={text}
                        isFilteringEnabled={(i === 0 || i === 2)
                        && settingsStore.isFilteringEnabled && settingsStore.isPageSecured}
                        handleClick={handleClick}
                    />
                ))}
        </div>
    );
});

export default Options;
