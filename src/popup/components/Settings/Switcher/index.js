import React from 'react';
import classNames from 'classnames';
import './switcher.pcss';

const Switcher = ({
    id, checked, onClick, tabIndex, isDisabled, label,
}) => {
    const switcherClass = classNames('switcher', {
        'switcher--disabled': isDisabled,
    });

    const buttonClass = classNames('switcher__label', {
        'switcher__label--disabled': isDisabled,
    });

    const clickHandler = () => {
        if (isDisabled) {
            return;
        }
        onClick();
    };

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            clickHandler();
        }
        return undefined;
    };

    return (
        <div className={switcherClass}>
            <input
                className="switcher__checkbox"
                type="checkbox"
                id={id}
                readOnly
                checked={checked}
            />
            <button
                className={buttonClass}
                type="button"
                aria-labelledby={label}
                tabIndex={tabIndex}
                onClick={clickHandler}
                onKeyDown={onKeyDown}
                title={label}
            />
            <div className="switcher__text">{label}</div>
        </div>
    );
};

export default Switcher;
