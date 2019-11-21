import React from 'react';
import classNames from 'classnames';
import './switcher.pcss';

const Switcher = ({
    id, text, checked, onClick, isPageSecured,
}) => {
    const switcherTextClass = classNames({
        switcher__text: true,
        'switcher__text--secured': isPageSecured,
    });

    const switcherLabelClass = classNames({
        switcher__label: true,
        'switcher__label--secured': isPageSecured,
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
};

export default Switcher;
