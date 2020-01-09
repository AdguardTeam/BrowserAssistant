import React, { useContext } from 'react';
import Modal from 'react-modal';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import rootStore from '../../../stores';
import { SECURE_PAGE_MODAL_IDS } from '../../../stores/consts';

const SecurePageModal = observer(({
    header, message, isOpen,
}) => {
    const { uiStore } = useContext(rootStore);
    const { securePageModalState } = uiStore;

    const modalClass = classNames({
        modal: true,
        'modal__secure-page': securePageModalState.id === SECURE_PAGE_MODAL_IDS.SECURE,
        'modal__insecure-page': securePageModalState.id === SECURE_PAGE_MODAL_IDS.NOT_SECURE,
        'modal__secure-page--bank': securePageModalState.id === SECURE_PAGE_MODAL_IDS.BANK,
    });

    return (
        <Modal
            isOpen={isOpen}
            className={modalClass}
            overlayClassName="overlay overlay--hidden"
            contentLabel="Secure Page Modal"
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
});

export default SecurePageModal;
