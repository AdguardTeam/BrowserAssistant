import React from 'react';
import classNames from 'classnames';
import translator from '../../../../lib/translator';
import './switcher.pcss';

const Switcher = ({
    id, checked, onClick, isSecured, tabIndex, isDisabled,
}) => {
    const switcherTextClass = classNames({
        switcher__text: true,
        'switcher__text--secured': isSecured,
    });

    const switcherClass = classNames({
        switcher__label: true,
        'switcher__label--disabled': isDisabled,
    });

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            onClick();
        }
        return undefined;
    };

    return (
        <div className="switcher">
            <input
                className="switcher__checkbox"
                type="checkbox"
                id={id}
                readOnly
                checked={checked}
            />
            <button
                className={switcherClass}
                type="button"
                aria-labelledby={translator.translate(checked ? 'enabled' : 'disabled')}
                tabIndex={tabIndex}
                onClick={onClick}
                onKeyDown={onKeyDown}
            />
            <div className={switcherTextClass}>{translator.translate(checked ? 'enabled' : 'disabled')}</div>
        </div>
    );
};

export default Switcher;
