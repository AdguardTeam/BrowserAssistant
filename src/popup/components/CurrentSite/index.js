import React from 'react';
import './currentSite.pcss';

const CurrentSite = () => {
    return (
        <div className="current-site__container">
            <span className="current-site__title">
                <img
                    className="current-site__icon"
                    src="../../../assets/images/icon-lock.svg"
                    alt="lock"
                />
                <span>
                    fonts.google.com
                </span>
            </span>
        </div>

    );
};

export default CurrentSite;
