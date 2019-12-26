import React from 'react';
import classNames from 'classnames';
import { SWITCHER_IDS } from '../../../stores/consts';
import './switcher.pcss';

const Switcher = ({
    id, checked, onClick, isPageSecured, certStatus, tabIndex,
}) => {
    const switcherTextClass = classNames({
        switcher__text: true,
        'switcher__text--secured': isPageSecured,
    });

    const switcherClass = classNames({
        switcher__label: true,
        'switcher__label--disabled': isPageSecured || (id === SWITCHER_IDS.HTTPS_SWITCHER && certStatus.isInvalid),
    });

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            return () => onClick();
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
                tabIndex={tabIndex}
                htmlFor={id}
                onClick={onClick}
                onKeyDown={onKeyDown}
            />
            <div className={switcherTextClass} />
        </div>
    );
};

export default Switcher;
