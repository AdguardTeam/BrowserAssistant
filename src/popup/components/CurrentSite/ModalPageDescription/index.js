import React, { Fragment } from 'react';
import ReactModal from 'react-modal';

const Info = ({ isOpen, onRequestClose }) => {
    const customStyles = {
        overlay: {
            backgroundColor: 'transparent',
        },
        content: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            zIndex: 2,
            width: '90%',
            height: '20%',
            left: '50%',
            top: '40%',
            transform: 'translate(-50%, -50%)',
            padding: '1rem',
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
                <p className="modal__text">Nothing to block here</p>
            </ReactModal>
        </Fragment>
    );
};

export default Info;
