import React, { Fragment } from 'react';
import ReactModal from 'react-modal';
import Switcher from '../../Settings/GlobalSwitcher';
import './modal.pcss';

const Modal = ({ isOpen, onRequestClose, isCertificateExpired }) => {
    const customStyles = {
        overlay: {
            backgroundColor: 'transparent',
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            zIndex: 2,
            width: '90%',
            height: '60%',
            left: '50%',
            right: 'auto',
            top: '60%',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };
    return (
        <Fragment>
            {isOpen && <div className="arrow-up" />}
            <ReactModal
                isOpen={isOpen}
                style={customStyles}
                contentLabel="Security ReactModal"
                onRequestClose={onRequestClose}
            >
                <div className="modal__info--upper">
                    <p>
                        <header className="modal__header">AdGuard HTTPS</header>
                        <p className="modal__text">Increases the quality of ad blocking</p>
                    </p>
                    <Switcher id="https-switcher" />
                </div>
                {isCertificateExpired && <p className="modal__text expired">
                    AdGuard could not verify this website&apos;s
                    certificate, because the root certificate has expired
                </p>}
                <div className="modal__info--lower">
                    <p className="modal__text">Verified by:</p>
                    <header className="modal__header">AdGuard Personal CA</header>
                    {isCertificateExpired && <p className="modal__text expired uppercase">expired</p>}
                    <p className="modal__text modal__link">More Information</p>
                </div>
            </ReactModal>
        </Fragment>
    );
};

export default Modal;
