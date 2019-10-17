import React, { Fragment } from 'react';
import ReactModal from 'react-modal';

const SecurePageModal = ({
    isOpen, onRequestClose, message, cn,
}) => (
    <Fragment>
        <ReactModal
            isOpen={isOpen}
            className={cn}
            style={{ overlay: { backgroundColor: 'transparent' } }}
            contentLabel="Secure Page Modal"
            onRequestClose={onRequestClose}
        >
            <header className="modal__header">Secure Page</header>
            <p className="modal__text">{message}</p>
        </ReactModal>
    </Fragment>
);

export default SecurePageModal;
