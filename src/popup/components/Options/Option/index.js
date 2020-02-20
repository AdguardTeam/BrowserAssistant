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

    const handleWhileEnabled = (handler) => (isDisabled ? undefined : handler);

    /* TODO: fix [object Object] */
    return (
        <div
            className={actionClass}
            onClick={handleWhileEnabled(onClick)}
            onKeyDown={handleWhileEnabled(onKeyDown)}
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

export default Option;
