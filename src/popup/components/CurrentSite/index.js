import React, { useState } from 'react';
import classNames from 'classnames';
import CertificateModal from './CertificateModal';
import SecurePageModal from './SecurePageModal';
import './currentSite.pcss';


const CurrentSite = ({ isTrusted, isHTTPS, isExpired }) => {
    const [isOpen, openModal] = useState(false);
    const [isInfoHovered, showInfo] = useState(false);
    const toggleOpenModal = () => openModal(!isOpen);
    const toggleShowInfo = () => showInfo(!isInfoHovered);
    const defineIcon = () => {
        if (isExpired) return 'icon-warning';
        if (isHTTPS) return 'icon-lock-danger';
        return 'icon-lock';
    };
    const expired = classNames({
        '--expired': isExpired,
    });
    return (
        <div
            className="current-site__container"
        >
            <span className={`current-site__title ${isTrusted ? 'trusted' : ''}`}>
                {!isTrusted && (
                    <img
                        className="current-site__icon"
                        src={`../../../assets/images/${defineIcon()}.svg`}
                        alt=" "
                        onClick={toggleOpenModal}
                    />
                )}
                <span>
                    <span className="current-site__name">fonts.google.com</span>
                    <CertificateModal
                        isOpen={isOpen}
                        onRequestClose={toggleOpenModal}
                        isExpired={isExpired}
                        cn={`modal modal__certificate modal__certificate${expired}`}
                    />
                    {!isExpired && (isTrusted || isHTTPS) && (
                        // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                        <span
                            onMouseOver={toggleShowInfo}
                            onMouseLeave={toggleShowInfo}
                            className="current-site__secure-status"
                        >
                        secure page
                        </span>
                    )}
                    <SecurePageModal
                        isOpen={isInfoHovered && !isHTTPS}
                        cn="modal modal__secure-page"
                        message="Nothing to block here"
                    />
                    <SecurePageModal
                        isOpen={isInfoHovered && isHTTPS}
                        cn="modal modal__secure-page modal__secure-page--bank"
                        message="By default, we don't filter HTTPS traffic for the payment system and bank websites.
                         You can enable the filtering yourself: tap on the yellow 'lock' on the left."
                    />
                </span>
            </span>
        </div>

    );
};

export default CurrentSite;
