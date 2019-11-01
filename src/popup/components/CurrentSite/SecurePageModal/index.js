import React, { useContext, Fragment } from 'react';
import Modal from 'react-modal';
import { observer } from 'mobx-react';
import rootStore from '../../../stores';

const SecurePageModal = observer(({ message, cn }) => {
    const { uiStore } = useContext(rootStore);

    return (
        <Fragment>
            <Modal
                isOpen
                className={cn}
                style={{ overlay: { backgroundColor: 'transparent' } }}
                contentLabel="Secure Page Modal"
                onRequestClose={() => { uiStore.toggleShowInfo(false); }}
            >
                <header
                    className="modal__header"
                    role="button"
                    tabIndex="0"
                    onFocus={() => uiStore.toggleShowInfo()}
                >
                    Secure Page
                </header>
                <p className="modal__text">{message}</p>
            </Modal>
        </Fragment>
    );
});

export default SecurePageModal;
