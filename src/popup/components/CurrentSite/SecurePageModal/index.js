import React, { Fragment } from 'react';
import Modal from 'react-modal';

const SecurePageModal = ({
    isOpen, message, cn,
}) => (
    <Fragment>
        <Modal
            isOpen={isOpen}
            className={cn}
            style={{ overlay: { backgroundColor: 'transparent' } }}
            contentLabel="Secure Page Modal"
        >
            <header className="modal__header">Secure Page</header>
            <p className="modal__text">{message}</p>
        </Modal>
    </Fragment>
);

export default SecurePageModal;
