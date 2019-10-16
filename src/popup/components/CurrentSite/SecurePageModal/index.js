import React, { Fragment } from 'react';
import ReactModal from 'react-modal';

const SecurePageModal = ({
    isOpen, onRequestClose, message, cn,
}) => {
    return (
        <Fragment>
            <ReactModal
                isOpen={isOpen}
                contentLabel="Security ReactModal"
                onRequestClose={onRequestClose}
                className={cn}
            >
                <header className="modal__header">Secure Page</header>
                <p className="modal__text">{message}</p>
            </ReactModal>
        </Fragment>
    );
};

export default SecurePageModal;
