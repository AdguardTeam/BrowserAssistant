import React, { useContext } from 'react';
import Modal from 'react-modal';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import rootStore from '../../../stores';
import { SECURE_STATUS_MODAL_IDS } from '../../../stores/consts';

const SecureStatusModal = observer(({
    header, message, isOpen,
}) => {
    const { uiStore } = useContext(rootStore);
    const { secureStatusModalInfo } = uiStore;
    const { formatMessage: f } = useIntl();

    const modalClass = classNames({
        modal: true,
        'modal__secure-status': secureStatusModalInfo.id === SECURE_STATUS_MODAL_IDS.SECURE,
        'modal__insecure-status': secureStatusModalInfo.id === SECURE_STATUS_MODAL_IDS.NOT_SECURE,
        'modal__secure-status--bank': secureStatusModalInfo.id === SECURE_STATUS_MODAL_IDS.BANK,
    });

    return (
        <Modal
            isOpen={isOpen}
            className={modalClass}
            overlayClassName="overlay overlay--hidden"
            contentLabel="Secure Status Modal"
            shouldFocusAfterRender={false}
        >
            <header className="modal__header">{f({ id: header })}</header>
            <p className="modal__text">{f({ id: message })}</p>
        </Modal>
    );
});

export default SecureStatusModal;
