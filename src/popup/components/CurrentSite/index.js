import React, { useState } from 'react';
import './currentSite.pcss';
import Modal from './Modal';
import ModalPageDescription from './ModalPageDescription';
import ModalCertificateInfo from './ModalCertificateInfo';

const CurrentSite = ({ isSecure, isSecureProtocol, isCertificateExpired }) => {
    const [isOpen, openModal] = useState(false);
    const [isInfoHovered, showInfo] = useState(false);
    const toggleOpenModal = () => openModal(!isOpen);
    const toggleShowInfo = () => showInfo(!isInfoHovered);
    const defineIcon = () => {
        if (isCertificateExpired) return 'icon-warning';
        if (isSecureProtocol) return 'icon-lock-danger';
        return 'icon-lock';
    }
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
                    <Modal
                        isOpen={isOpen}
                        onRequestClose={toggleOpenModal}
                        isCertificateExpired={isCertificateExpired}
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
                    <ModalPageDescription isOpen={isInfoHovered && !isSecureProtocol} />
                    <ModalCertificateInfo isOpen={isInfoHovered && isSecureProtocol} />
                </span>
            </span>
        </div>

    );
};

export default CurrentSite;
