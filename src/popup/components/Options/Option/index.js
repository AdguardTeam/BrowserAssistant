import React from 'react';
import './option.pcss';

const Option = ({ iconName, text }) => (
    <div className="action">
        <span className="action-icon">
            <img
                src={`../../../assets/images/${iconName}.svg`}
                alt=""
            />
        </span>
        <span
            className="action-name"
            role="button"
        >
            {text}
        </span>
    </div>
);

export default Option;
