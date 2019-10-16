import React, { Fragment } from 'react';
import ReactModal from 'react-modal';

const ModalHttpsInfo = ({ isOpen, onRequestClose }) => {
    const customStyles = {
        overlay: {
            backgroundColor: 'transparent',
        },
        content: {
            padding: '2rem',
            zIndex: 2,
            width: '90%',
            height: '40%',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
        },
    };
    return (
        <Fragment>
            <ReactModal
                isOpen={isOpen}
                style={customStyles}
                contentLabel="Security ReactModal"
                onRequestClose={onRequestClose}
            >
                <header className="modal__header">Secure Page</header>
                <p className="modal__text">By default, we don&apos;t filter HTTPS traffic for the payment system and bank websites. You can enable the filtering yourself: tap on the yellow &apos;lock&apos; on the left.</p>
            </ReactModal>
        </Fragment>
    );
};

export default ModalHttpsInfo;
