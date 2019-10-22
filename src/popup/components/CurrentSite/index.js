import React, { useState } from 'react';
import classNames from 'classnames';
import CertificateModal from './CertificateModal';
import SecurePageModal from './SecurePageModal';
import './currentSite.pcss';


const CurrentSite = ({ isPageSecured, isHttpsFilteringEnabled, isExpired }) => {
    const [isOpen, openModal] = useState(false);
    const [isInfoHovered, showInfo] = useState(false);

    const toggleShowInfo = () => showInfo(!isInfoHovered);
    const toggleOpenModal = () => {
        let bodyHeight = '32rem';
        if (isExpired && !isOpen) {
            bodyHeight = '44rem';
        }
        if (isExpired && isOpen) {
            bodyHeight = '32rem';
        }
        document.querySelector('body').style.height = bodyHeight;
        return openModal(!isOpen);
    };


    const iconClass = classNames({
        'current-site__icon': true,
        'current-site__icon--warning': isExpired,
        'current-site__icon--lock-danger': isHttpsFilteringEnabled,
        'current-site__icon--lock': !isHttpsFilteringEnabled,
    });

    const expiredClass = classNames({
        'modal modal__certificate': true,
        'modal__certificate--expired': isExpired,
    });

    const securedClass = classNames({
        'current-site__title': true,
        'current-site__title--secured': isPageSecured,
    });

    const secureStatusClass = classNames({
        'current-site__secure-status': true,
        'current-site__secure-status--hidden': isOpen,
    });

    return (
        <div
            className="current-site__container"
        >
            <div className={securedClass}>
                {!isPageSecured && (
                    <button
                        type="button"
                        onClick={toggleOpenModal}
                        className={iconClass}
                    />
                )}
                <div className="current-site__name">fonts.google.com</div>
                <CertificateModal
                    isOpen={isOpen}
                    onRequestClose={toggleOpenModal}
                    isExpired={isExpired}
                    cn={expiredClass}
                />
                {(isPageSecured || (!isExpired && isHttpsFilteringEnabled)) && (
                    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                    <span
                        onMouseOver={toggleShowInfo}
                        onMouseLeave={toggleShowInfo}
                        className={secureStatusClass}
                    >
                        secure page
                    </span>
                )}
                <SecurePageModal
                    isOpen={isInfoHovered && !isHttpsFilteringEnabled}
                    cn="modal modal__secure-page"
                    message="Nothing to block here"
                />
                <SecurePageModal
                    isOpen={isInfoHovered && isHttpsFilteringEnabled}
                    cn="modal modal__secure-page modal__secure-page--bank"
                    message="By default, we don't filter HTTPS traffic for the payment system and bank websites.
                         You can enable the filtering yourself: tap on the yellow 'lock' on the left."
                />
            </div>
        </div>

    );
};

export default CurrentSite;
