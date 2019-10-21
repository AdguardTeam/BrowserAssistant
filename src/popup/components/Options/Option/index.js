import React from 'react';
import classNames from 'classnames';
import './option.pcss';

const Option = ({ iconName, text, isDisabled }) => {
    const actionClass = classNames({
        action: true,
        'action--disabled': isDisabled,
    });

    return (
        <div className={actionClass}>
            <div className={`action__icon action__icon--${iconName}`} role="img" />
            <div
                className="action__name"
                role="button"
            >
                {text}
            </div>
        </div>

    );
};

export default Option;
