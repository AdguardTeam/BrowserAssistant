import React, { Fragment, useContext } from 'react';
import { observer } from 'mobx-react';
import Modal from 'react-modal';
import classNames from 'classnames';
import Switcher from '../../Settings/Switcher';
import rootStore from '../../../stores';
import { SWITCHER_IDS, CERT_STATES } from '../../../stores/consts';
import './modal.pcss';

const CertificateModal = observer(({ onRequestClose, isOpen }) => {
    const { uiStore, settingsStore, requestsStore } = useContext(rootStore);
    const { certStatus } = uiStore;
    const {
        setHttpsFiltering,
        isHttpsFilteringEnabled,
        originalCertIssuer,
        isHttps,
        isPageSecured,
        originalCertStatus,
        isFilteringEnabled,
    } = settingsStore;

    const showCertificate = () => requestsStore.openOriginalCert();

    const toggleHttpsFiltering = () => {
        return !certStatus.isInvalid
            ? setHttpsFiltering(!isHttpsFilteringEnabled)
            : undefined;
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            showCertificate();
        }
    };

    const bodyClass = classNames({
        'height--extended': certStatus.isInvalid && originalCertIssuer,
    });

    const modalClass = classNames({
        'modal modal__certificate': true,
        'modal__certificate--small': certStatus.isNotFound || certStatus.isBypassed
            || (certStatus.isInvalid && !originalCertIssuer),
        'modal__certificate--large': certStatus.isInvalid && originalCertIssuer,
        // This case can happen only as result of host mistake
        'modal__certificate--tiny': certStatus.isValid && !originalCertIssuer,
    });

    return (
        <Modal
            isOpen={isOpen}
            className={modalClass}
            overlayClassName="overlay overlay--fullscreen"
            contentLabel="Certificate Modal"
            bodyOpenClassName={bodyClass}
            onRequestClose={onRequestClose}
        >
            <div className="modal__info--upper">
                <span className="modal__header modal__header--container">
                    <span className="modal__header">AdGuard HTTPS</span>
                    <p className="modal__text modal__text--additional">Increases the quality of ad blocking</p>
                </span>
                <Switcher
                    id={SWITCHER_IDS.HTTPS_SWITCHER}
                    checked={!certStatus.isInvalid && isHttpsFilteringEnabled && isHttps}
                    onClick={toggleHttpsFiltering}
                    isPageSecured={isPageSecured}
                    isFilteringEnabled={isFilteringEnabled}
                    isHttps={isHttps}
                    certStatus={certStatus}
                />
            </div>
            {!certStatus.isValid && CERT_STATES[originalCertStatus] && (
                <p className="modal__text modal__text--red modal__text--upper">
                    {`AdGuard could not verify this website's
                    certificate, because ${CERT_STATES[originalCertStatus]}`}
                </p>
            )}
            <div className="modal__info--lower">
                {originalCertIssuer && (certStatus.isValid || certStatus.isInvalid)
                && (
                    <Fragment>
                        <p className="modal__text modal__text--notion">Verified by:</p>
                        <div className="modal__header modal__header--issuer">{originalCertIssuer}</div>
                        {!certStatus.isInvalid && (
                            <div
                                className="modal__text modal__text--link"
                                role="button"
                                tabIndex="0"
                                onClick={showCertificate}
                                onKeyDown={handleKeyDown}
                            >
                                More Information
                            </div>
                        )}
                    </Fragment>
                )}
            </div>
        </Modal>
    );
});

export default CertificateModal;
