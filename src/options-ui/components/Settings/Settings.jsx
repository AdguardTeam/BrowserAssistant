import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import { translator } from '../../../shared/translators/translator';
import { optionsUiStore } from '../../stores';

import './settings.pcss';

export const Settings = observer(() => {
    const { settingsStore } = useContext(optionsUiStore);

    const handleChange = async (e) => {
        await settingsStore.setContextMenuState(e.target.checked);
    };

    return (
        <>
            <label
                htmlFor="context_menu"
                className="checkbox-label"
            >
                {translator.getMessage('options_context_menu_title')}
            </label>
            <input
                checked={settingsStore.contextEnabled}
                onChange={handleChange}
                type="checkbox"
                id="context_menu"
                name="context_menu"
            />
        </>
    );
});
