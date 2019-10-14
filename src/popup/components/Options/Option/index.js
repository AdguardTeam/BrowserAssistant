import React from "react";
import "./option.pcss"

const Option = ({name, text}) => (
    <div className="action">
        <span className="act-icon">
            <img
                src={`../../../assets/images/${name}.svg`}
                alt=""
            />
        </span>
        <span
            className="act-name"
            role="button"
        >
            {text}
        </span>
    </div>
)

export default Option;

