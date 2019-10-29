import React, { Fragment, useContext } from 'react';
import { observer } from 'mobx-react';
import Modal from 'react-modal';
import Switcher from '../../Settings/Switcher';
import rootStore from '../../../stores';
import './modal.pcss';

const CertificateModal = observer(({ cn, onRequestClose }) => {
    const { uiStore, settingsStore, requestsStore } = useContext(rootStore);

    const showCertificate = () => {
        console.log('showCertificate');
        return requestsStore.openOriginCert();
    };

    return (
        <Fragment>
            <Modal
                isOpen={uiStore.isOpenCertificateModal}
                className={cn}
                style={{ overlay: { backgroundColor: 'transparent' } }}
                contentLabel="Certificate Modal"
                onRequestClose={onRequestClose}
            >
                <div className="modal__info--upper">
                    <span>
                        <span className="modal__header">AdGuard HTTPS</span>
                        <p className="modal__text modal__text--additional">Increases the quality of ad blocking</p>
                    </span>
                    <Switcher id="https-switcher" />
                </div>
                {settingsStore.isExpired && (
                    <p className="modal__text modal__text--expired">
                        AdGuard could not verify this website&apos;s
                        certificate, because the root certificate has expired
                    </p>
                )}
                <div className="modal__info--lower">
                    <p className="modal__text modal__text--notion">Verified by:</p>
                    <span className="modal__header">AdGuard Personal CA</span>
                    {settingsStore.isExpired
                    && <p className="modal__text modal__text--warning modal__text--expired modal__text--uppercase">expired</p>}
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                    <div
                        className="modal__text modal__text--link"
                        role="button"
                        tabIndex="0"
                        onClick={showCertificate}
                    >
                        More Information
                    </div>
                </div>
            </Modal>
        </Fragment>
    );
});

export default CertificateModal;
