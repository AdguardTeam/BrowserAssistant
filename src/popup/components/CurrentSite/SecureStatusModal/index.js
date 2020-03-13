import React, { useContext } from 'react';
import Modal from 'react-modal';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import rootStore from '../../../stores';
import { SECURE_STATUS_MODAL_IDS } from '../../../stores/consts';

const SecureStatusModal = observer(({
    header, message, isOpen,
}) => {
    const {
        uiStore: { secureStatusModalInfo },
        translationStore: { translate },
    } = useContext(rootStore);

    const modalClass = classNames({
        modal: true,
        'modal__secure-status': secureStatusModalInfo.modalId === SECURE_STATUS_MODAL_IDS.SECURE,
        'modal__insecure-status': secureStatusModalInfo.modalId === SECURE_STATUS_MODAL_IDS.NOT_SECURE,
        'modal__secure-status--bank': secureStatusModalInfo.modalId === SECURE_STATUS_MODAL_IDS.BANK,
    });

    return (
        <Modal
            isOpen={isOpen}
            className={modalClass}
            overlayClassName="overlay overlay--hidden"
            contentLabel="Secure Status Modal"
            shouldFocusAfterRender={false}
        >
            {header && <header className="modal__header">{translate(header)}</header>}
            {message && <p className="modal__text modal__text--message">{translate(message)}</p>}
        </Modal>
    );
});

export default SecureStatusModal;
