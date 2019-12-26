import React from 'react';
import classNames from 'classnames';
import './option.pcss';

const Option = ({
    iconName, text, onClick, isDisabled, tabIndex,
}) => {
    const actionClass = classNames({
        action: true,
        'action--disabled': isDisabled,
    });

    const onKeyDown = (e) => {
        if (e.key === 'Enter') {
            onClick();
        }
    };
    const handleWhileEnabled = handler => (isDisabled ? undefined : handler);

    return (
        <div
            className={actionClass}
            onClick={handleWhileEnabled(onClick)}
            onKeyDown={handleWhileEnabled(onKeyDown)}
            role="menuitem"
            tabIndex={tabIndex}
        >
            <span className={`action__icon action__icon--${iconName}`} />
            <span className="action__name">
                {text}
            </span>
        </div>

    );
};

export default Option;
