import React, { useContext } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import './switcher.pcss';
import rootStore from '../../../stores';

const Switcher = observer(({
    id,
    text,
    checked,
    onClick,
}) => {
    const { settingsStore } = useContext(rootStore);

    const switcherTextClass = classNames({
        switcher__text: true,
        'switcher__text--secured': settingsStore.isPageSecured,
    });

    const switcherLabelClass = classNames({
        switcher__label: true,
        'switcher__label--secured': settingsStore.isPageSecured,
        'switcher__label--disabled': !settingsStore.isFilteringEnabled,
    });

    return (
        <div className="switcher">
            <input
                className="switcher__checkbox"
                type="checkbox"
                id={id}
                readOnly
                checked={checked}
            />
            <div className={switcherTextClass}>
                {text}
            </div>
            <label
                className={switcherLabelClass}
                htmlFor={id}
                onClick={onClick}
            />
        </div>
    );
});

export default Switcher;
