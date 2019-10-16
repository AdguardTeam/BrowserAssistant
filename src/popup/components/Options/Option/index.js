import React from 'react';
import classNames from 'classnames';
import './option.pcss';

const Option = ({ iconName, text, isDisabled }) => {
    const optionCSSName = 'action-name';
    const optionClass = classNames({
        [optionCSSName]: true,
        [`${optionCSSName}--disabled`]: isDisabled,
    });
    const iconCSSName = 'action-icon';
    const iconClass = classNames({
        [iconCSSName]: true,
        [`${iconCSSName}--disabled`]: isDisabled,

    });
    return (
        <div className="action">
            <span className={iconClass}>
                <img
                    src={`../../../assets/images/${iconName}.svg`}
                    alt=""
                />
            </span>
            <span
                className={optionClass}
                role="button"
            >
                {text}
            </span>
        </div>
    );
};

export default Option;
