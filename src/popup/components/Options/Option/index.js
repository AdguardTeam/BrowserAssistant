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
            onClick={!isDisabled ? handleClick : undefined}
            onKeyDown={handleKeyDown}
            role="menuitem"
            tabIndex="0"
        >
            <span className={`action__icon action__icon--${iconName}`} />
            <span className="action__name">
                {text}
            </span>
        </div>

    );
};

export default Option;
