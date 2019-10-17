import React, { Fragment } from 'react';
import ReactModal from 'react-modal';
import Switcher from '../../Settings/GlobalSwitcher';
import './modal.pcss';

const CertificateModal = ({
    isOpen, onRequestClose, isExpired, cn,
}) => (
    <Fragment>
        {isOpen && <div className="arrow-up" />}
        <ReactModal
            isOpen={isOpen}
            className={cn}
            style={{ overlay: { backgroundColor: 'transparent' } }}
            contentLabel="Certificate Modal"
            onRequestClose={onRequestClose}
        >
            <div className="modal__info--upper">
                <p>
                    <header className="modal__header">AdGuard HTTPS</header>
                    <p className="modal__text">Increases the quality of ad blocking</p>
                </p>
                <Switcher id="https-switcher" />
            </div>
            {isExpired && (
            <p className="modal__text modal__text--expired">
                    AdGuard could not verify this website&apos;s
                    certificate, because the root certificate has expired
            </p>
            )}
            <div className="modal__info--lower">
                <p className="modal__text">Verified by:</p>
                <header className="modal__header">AdGuard Personal CA</header>
                {isExpired && <p className="modal__text modal__text--expired modal__text--uppercase">expired</p>}
                <p className="modal__text modal__text--link">More Information</p>
            </div>
        </ReactModal>
    </Fragment>
);

export default CertificateModal;
