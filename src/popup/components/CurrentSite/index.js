import React, { useState } from 'react';
import './currentSite.pcss';
import CertificateModal from './CertificateModal';
import SecurePageModal from './SecurePageModal';

const CurrentSite = ({ isSecure, isSecureProtocol, isCertificateExpired }) => {
    const [isOpen, openModal] = useState(false);
    const [isInfoHovered, showInfo] = useState(false);
    const toggleOpenModal = () => openModal(!isOpen);
    const toggleShowInfo = () => showInfo(!isInfoHovered);
    const defineIcon = () => {
        if (isCertificateExpired) return 'icon-warning';
        if (isSecureProtocol) return 'icon-lock-danger';
        return 'icon-lock';
    };
    return (
        <div
            className="current-site__container"
        >
            <span className="current-site__title">
                {!isSecure && (
                    <img
                        className="current-site__icon"
                        src={`../../../assets/images/${defineIcon()}.svg`}
                        alt=" "
                        onClick={toggleOpenModal}
                    />
                )}
                <span>
                    <main className="current-site__name">fonts.google.com</main>
                    <CertificateModal
                        isOpen={isOpen}
                        onRequestClose={toggleOpenModal}
                        isCertificateExpired={isCertificateExpired}
                        cn={`modal modal__certificate modal${isCertificateExpired ? '--expired' : ''}`}
                    />
                    {!isCertificateExpired && (isSecure || isSecureProtocol) && (
                        <span
                            onMouseOver={toggleShowInfo}
                            onMouseLeave={toggleShowInfo}
                            className="current-site__secure-status"
                        >
                        secure page
                        </span>
                    )}
                    <SecurePageModal
                        isOpen={isInfoHovered && !isSecureProtocol}
                        cn="modal modal__secure-page"
                        message="Nothing to block here"
                    />
                    <SecurePageModal
                        isOpen={isInfoHovered && isSecureProtocol}
                        cn="modal modal__secure-page modal__secure-page--bank"
                        message={`By default, we don't filter HTTPS traffic for the payment system and bank websites.
                         You can enable the filtering yourself: tap on the yellow 'lock' on the left.`}
                    />
                </span>
            </span>
        </div>

    );
};

export default CurrentSite;
