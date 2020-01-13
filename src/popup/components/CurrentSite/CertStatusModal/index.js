import React, { Fragment, useContext } from 'react';
import { observer } from 'mobx-react';
import Modal from 'react-modal';
import classNames from 'classnames';
import { useIntl } from 'react-intl';
import Switcher from '../../Settings/Switcher';
import rootStore from '../../../stores';
import { SWITCHER_IDS, CERT_STATES } from '../../../stores/consts';
import './modal.pcss';

const CertStatusModal = observer(({ onRequestClose, isOpen }) => {
    const { uiStore, settingsStore, requestsStore } = useContext(rootStore);
    const { formatMessage: f } = useIntl();
    const { certStatus } = uiStore;
    const {
        setHttpsFiltering,
        isHttpsFilteringEnabled,
        originalCertIssuer,
        isHttps,
        isPageSecured,
        originalCertStatus,
    } = settingsStore;

    const showCert = () => {
        requestsStore.openOriginalCert();
    };

    const toggleHttpsFiltering = () => {
        if (!certStatus.isInvalid) {
            setHttpsFiltering(!isHttpsFilteringEnabled);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            showCert();
        }
    };

    const bodyClass = classNames({
        'height--extended': certStatus.isInvalid && originalCertIssuer,
    });

    const modalClass = classNames({
        'modal modal__cert-status': true,
        'modal__cert-status--small': certStatus.isNotFound || certStatus.isBypassed
            || (certStatus.isInvalid && !originalCertIssuer),
        'modal__cert-status--large': certStatus.isInvalid && originalCertIssuer,
        // This case can happen only as result of host mistake
        'modal__cert-status--tiny': certStatus.isValid && !originalCertIssuer,
    });

    return (
        <Modal
            isOpen={isOpen}
            className={modalClass}
            overlayClassName="overlay overlay--fullscreen"
            contentLabel="Certificate Modal"
            bodyOpenClassName={bodyClass}
            onRequestClose={onRequestClose}
            shouldFocusAfterRender={false}
        >
            <div className="modal__info--upper">
                <span className="modal__header modal__header--container">
                    <span className="modal__header">{f({ id: 'adg_https' })}</span>
                    <p className="modal__text modal__text--additional">{f({ id: 'increase_ab_block_quality' })}</p>
                </span>
                <Switcher
                    id={SWITCHER_IDS.HTTPS_SWITCHER}
                    checked={!certStatus.isInvalid && isHttpsFilteringEnabled && isHttps}
                    onClick={toggleHttpsFiltering}
                    isPageSecured={isPageSecured}
                    isDisabled={certStatus.isInvalid}
                />
            </div>
            {!certStatus.isValid && CERT_STATES[originalCertStatus] && (
                <p className="modal__text modal__text--red modal__text--upper">
                    {`${f({ id: 'could_not_verify_cert' })} ${f({ id: CERT_STATES[originalCertStatus] }).toLowerCase()}`}
                </p>
            )}
            <div className="modal__info--lower">
                {originalCertIssuer && (certStatus.isValid || certStatus.isInvalid)
                && (
                    <Fragment>
                        <p className="modal__text modal__text--notion">{f({ id: 'verified_by' })}</p>
                        <div className="modal__header modal__header--issuer">{originalCertIssuer}</div>
                        {certStatus.isValid && (
                            <div
                                className="modal__text modal__text--link"
                                role="button"
                                tabIndex={uiStore.globalTabIndex}
                                onClick={showCert}
                                onKeyDown={handleKeyDown}
                            >
                                {f({ id: 'more_info' })}
                            </div>
                        )}
                    </Fragment>
                )}
            </div>
        </Modal>
    );
});

export default CertStatusModal;
