import React from 'react';
import Modal from 'react-modal';

const SecurePageModal = ({
    header, message, cn, isOpen, onAfterOpen, ...otherProps
}) => (
    <Modal
        isOpen={isOpen}
        className={cn}
        overlayClassName="overlay overlay--hidden"
        contentLabel="Secure Page Modal"
        onAfterOpen={onAfterOpen}
        {...otherProps}
        shouldFocusAfterRender={false}
    >
        <header
            className="modal__header"
        >
            {header}
        </header>
        <p className="modal__text">{message}</p>
    </Modal>
);

export default SecurePageModal;
