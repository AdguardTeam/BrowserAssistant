import React, { Fragment } from 'react';
import ReactModal from 'react-modal';
import Switcher from '../../Settings/GlobalSwitcher';
import './modal.pcss';

const CertificateModal = ({
    isOpen,
    onRequestClose,
    isExpired,
    cn,
    isHttpsFilteringEnabled, toggleHttpsFiltering,
}) => {
    const showCertificate = () => {
        console.log('showCertificate');
        return adguard.requests.openOriginCert();
    };
    return (
        <Fragment>
            <ReactModal
                isOpen={isOpen}
                className={cn}
                style={{ overlay: { backgroundColor: 'transparent' } }}
                contentLabel="Certificate Modal"
                onRequestClose={onRequestClose}
            >
                <div className="modal__info--upper">
                    <div className="arrow-up" />
                    <span>
                        <span className="modal__header">AdGuard HTTPS</span>
                        <p className="modal__text modal__text--additional">Increases the quality of ad blocking</p>
                    </span>
                    <Switcher
                        id="https-switcher"
                        isHttpsFilteringEnabled={isHttpsFilteringEnabled}
                        toggleHttpsFiltering={toggleHttpsFiltering}
                    />
                </div>
                {isExpired && (
                    <p className="modal__text modal__text--expired">
                        AdGuard could not verify this website&apos;s
                        certificate, because the root certificate has expired
                    </p>
                )}
                <div className="modal__info--lower">
                    <p className="modal__text modal__text--notion">Verified by:</p>
                    <span className="modal__header">AdGuard Personal CA</span>
                    {isExpired
                    && <p className="modal__text modal__text--warning modal__text--expired modal__text--uppercase">expired</p>}
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                    <div className="modal__text modal__text--link" role="button" tabIndex="0" onClick={showCertificate}>More Information</div>
                </div>
            </ReactModal>
        </Fragment>
    );
};

export default CertificateModal;
