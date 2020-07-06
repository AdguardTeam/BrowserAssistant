import classnames from 'classnames';
import React, { useContext } from 'react';
import rootStore from '../../../stores';

const ClosedApp = ({
    isLoading, content, buttonText, globalTabIndex, onClick,
}) => {
    const { translationStore } = useContext(rootStore);

    const { translate } = translationStore;

    const buttonClass = classnames({
        'app-closed__button': true,
        'app-closed__button--transparent': isLoading,
    });

    const handleClick = (e) => {
        e.target.blur();
        if (onClick) {
            onClick();
        }
    };

    return (
        <div className="app-closed__container">
            <div className="app-closed__status-container">
                <header className="app-closed__status">{translate(content)}</header>
            </div>
            {buttonText && (
                <div>
                    <button
                        className={buttonClass}
                        type="button"
                        tabIndex={globalTabIndex}
                        onClick={handleClick}
                    >
                        {translate(buttonText)}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ClosedApp;
