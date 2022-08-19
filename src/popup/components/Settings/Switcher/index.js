import React, { useContext } from 'react';
import classNames from 'classnames';
import rootStore from '../../../stores';
import './switcher.pcss';

const Switcher = ({
    id,
    checked,
    onClick,
    tabIndex,
    isDisabled,
    label,
    isException,
}) => {
    const { translationStore: { translate } } = useContext(rootStore);

    const switcherClass = classNames('switcher', {
        'switcher--disabled': isDisabled,
        'switcher--exception': isException,
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

    const switcherLabel = isException
        ? translate('filtering_exception')
        : label;

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
                aria-labelledby={switcherLabel}
                tabIndex={tabIndex}
                onClick={clickHandler}
                onKeyDown={onKeyDown}
                title={switcherLabel}
            />
            <div className="switcher__text">{switcherLabel}</div>
        </div>
    );
};

export default Switcher;
