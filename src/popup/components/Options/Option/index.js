import React from 'react';
import classNames from 'classnames';
import './option.pcss';

const Option = ({
    iconName, text, isFilteringEnabled, handleClick,
}) => {
    const actionClass = classNames({
        action: true,
        'action--disabled': !isFilteringEnabled,
    });

    return (
        <div
            className={actionClass}
            onClick={handleClick}
            onKeyPress={e => console.log(e)}
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
