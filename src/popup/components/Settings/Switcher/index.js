import React from 'react';
import classNames from 'classnames';
import './switcher.pcss';

const Switcher = ({
    id, checked, onClick, isSecured, tabIndex, isDisabled, label,
}) => {
    const switcherTextClass = classNames({
        switcher__text: true,
        'switcher__text--secured': isSecured,
    });

    const switcherClass = classNames({
        switcher__label: true,
        'switcher__label--disabled': isDisabled && !isSecured,
        'switcher__label--secured': isSecured,
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
                aria-labelledby={label}
                tabIndex={tabIndex}
                onClick={onClick}
                onKeyDown={onKeyDown}
            />
            <div className={switcherTextClass}>{label}</div>
        </div>
    );
};

export default Switcher;
