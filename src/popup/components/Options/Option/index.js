import React, { useContext } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import rootStore from '../../../stores';
import './option.pcss';

const Option = observer(({
    iconName, text, handleClick,
}) => {
    const { settingsStore, uiStore } = useContext(rootStore);
    const actionClass = classNames({
        action: true,
        'action--disabled': ((iconName !== 'sandwich' && iconName !== 'icon-cross')
            && !settingsStore.isFilteringEnabled),
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
});

export default Option;
