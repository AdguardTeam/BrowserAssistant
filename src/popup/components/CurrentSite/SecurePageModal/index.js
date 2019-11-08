import React, { Fragment } from 'react';
import Modal from 'react-modal';

const SecurePageModal = ({
    header, message, cn, isOpen, onRequestClose,
}) => {
    return (
        <Fragment>
            <Modal
                isOpen={isOpen}
                className={cn}
                style={{ overlay: { backgroundColor: 'transparent' } }}
                contentLabel="Secure Page Modal"
                onRequestClose={onRequestClose}
            >
                <header
                    className="modal__header"
                >
                    {header}
                </header>
                <p className="modal__text">{message}</p>
            </Modal>
        </Fragment>
    );
};

export default SecurePageModal;
