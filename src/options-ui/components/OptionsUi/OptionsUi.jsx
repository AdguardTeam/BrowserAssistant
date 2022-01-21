import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';

import { Settings } from '../Settings';
import { optionsUiStore } from '../../stores';

import './options-ui.pcss';

export const OptionsUi = observer(() => {
    const { settingsStore } = useContext(optionsUiStore);

    useEffect(() => {
        settingsStore.getSettings();
    }, []);

    if (!settingsStore.settingsReceived) {
        return null;
    }

    return (
        <div className="options">
            <Settings />
        </div>
    );
});
