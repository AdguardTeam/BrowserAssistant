import React from 'react';
import classNames from 'classnames';
import './option.pcss';

const Option = ({
    iconName, text, handleClick, isDisabled,
}) => {
    const actionClass = classNames({
        action: true,
        'action--disabled': isDisabled,
    });

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !isDisabled) {
            handleClick();
        }
    };

    return (
        <div
            className={actionClass}
            onClick={!isDisabled && handleClick}
            onKeyDown={handleKeyDown}
            role="menuitem"
            tabIndex="0"
        >
            <div className={`action__icon action__icon--${iconName}`} />
            <div
                className="action__name"
            >
                {text}
            </div>
        </div>

    );
};

export default Option;
