import React from 'react';
import classNames from 'classnames';
import './option.pcss';

const Option = ({ iconName, text, isDisabled }) => {
    const disabledClass = classNames({
        'action--disabled': isDisabled,
    });
    return (
        <div className={`action ${disabledClass}`}>
            <div className={`action-icon ${iconName}`} role="img" />
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
