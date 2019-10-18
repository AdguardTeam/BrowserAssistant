import React from 'react';
import classNames from 'classnames';
import './option.pcss';

const Option = ({ iconName, text, isDisabled }) => {
    const actionClass = classNames({
        action: true,
        'action--disabled': isDisabled,
    });

    const iconClass = classNames({
        'action-icon': true,
        [iconName]: true,
    });

    return (
        <div className={actionClass}>
            <div className={iconClass} role="img" />
            <div
                className="action-name"
                role="button"
            >
                {text}
            </div>
        </div>
    );
};

export default Option;
