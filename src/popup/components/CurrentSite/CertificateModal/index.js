import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Modal from 'react-modal';
import Switcher from '../../Settings/Switcher';
import rootStore from '../../../stores';
import './modal.pcss';

const CertificateModal = observer(({ cn, onRequestClose, isOpen }) => {
    const { settingsStore, requestsStore } = useContext(rootStore);

    const showCertificate = () => requestsStore.openOriginCert();

    const handleHttpsFiltering = () => {
        settingsStore.setHttpsFiltering(!settingsStore.isHttpsFilteringEnabled);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            showCertificate();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            className={cn}
            overlayClassName="overlay overlay--fullscreen"
            contentLabel="Certificate Modal"
            bodyOpenClassName={settingsStore.isExpired ? 'size--expanded' : null}
            onRequestClose={onRequestClose}
        >
            <div className="modal__info--upper">
                <span className="modal__header--container">
                    <span className="modal__header">AdGuard HTTPS</span>
                    <p className="modal__text modal__text--additional">Increases the quality of ad blocking</p>
                </span>
                <Switcher
                    id="https-switcher"
                    checked={settingsStore.isHttpsFilteringEnabled && settingsStore.isHttps}
                    onClick={handleHttpsFiltering}
                    isPageSecured={settingsStore.isPageSecured}
                    isFilteringEnabled={settingsStore.isFilteringEnabled}
                    isHttps={settingsStore.isHttps}
                />
            </div>
            {settingsStore.isExpired && (
                <p className="modal__text modal__text--expired modal__text--expired--upper">
                    AdGuard could not verify this website&apos;s
                    certificate, because the root certificate has expired
                </p>
            )}
            <div className="modal__info--lower">
                <p className="modal__text modal__text--notion">Verified by:</p>
                <span className="modal__header">AdGuard Personal CA</span>
                {settingsStore.isExpired
                && <p className="modal__text modal__text--expired modal__text--expired--lower modal__text--uppercase">expired</p>}
                <div
                    className="modal__text modal__text--link modal__text--cert"
                    role="button"
                    tabIndex="0"
                    onClick={showCertificate}
                    onKeyDown={handleKeyDown}
                >
                    More Information
                </div>
            </div>
        </Modal>
    );
});

export default CertificateModal;
