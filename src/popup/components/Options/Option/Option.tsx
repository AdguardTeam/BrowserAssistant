import React, { KeyboardEventHandler } from 'react';
import classNames from 'classnames';

import './option.pcss';

interface OptionProps {
    iconName: string
    text: string
    onClick: () => void
    isDisabled: boolean
    tabIndex: number
}

export const Option = ({
    iconName,
    text,
    onClick,
    isDisabled,
    tabIndex,
}: OptionProps) => {
    const actionClass = classNames({
        action: true,
        'action--disabled': isDisabled,
    });

    const handleClick = () => {
        if (isDisabled) {
            return;
        }
        onClick();
    };

    const handleKeyDown: KeyboardEventHandler = (e) => {
        if (isDisabled) {
            return;
        }
        if (e.key === 'Enter') {
            onClick();
        }
    };

    return (
        <div
            className={actionClass}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            title={text}
            role="menuitem"
            tabIndex={tabIndex}
        >
            <div className="action__item">
                <span className={`action__icon action__icon--${iconName}`} />
                <div className="action__text">{text}</div>
            </div>
        </div>
    );
};
