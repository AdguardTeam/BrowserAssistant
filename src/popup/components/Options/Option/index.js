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
            <div className={`action-icon ${iconName}`} role="img" />
            <divs
                className="action-name"
                role="button"
            >
                {text}
            </divs>
        </div>

    );
};

export default Option;
