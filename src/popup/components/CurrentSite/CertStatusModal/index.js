import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Modal from 'react-modal';
import classNames from 'classnames';
import Switcher from '../../Settings/Switcher';
import rootStore from '../../../stores';
import { SWITCHER_IDS, CERT_STATES } from '../../../stores/consts';
import translator from '../../../../lib/translator';
import './modal.pcss';

const CertStatusModal = observer(({ onRequestClose, isOpen }) => {
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

    const modalClass = classNames({
        'modal modal__cert-status': true,
        'modal__cert-status--small': certStatus.isNotFound || certStatus.isBypassed
            || (certStatus.isInvalid && !originalCertIssuer),
        'modal__cert-status--large': certStatus.isInvalid && originalCertIssuer,
        'modal__cert-status--smallest': certStatus.isValid && !isFilteringEnabled,
        // This case can happen only as result of host mistake
        'modal__cert-status--tiny': certStatus.isValid && !originalCertIssuer,
    });

    const lowerInfoClass = classNames({
        'modal__info--lower': certStatus.isValid,
        'modal__info--lower--no-padding': certStatus.isInvalid || (isHttps && !isFilteringEnabled),
    });

    return (
        <Modal
            isOpen={isOpen}
            className={modalClass}
            overlayClassName="overlay overlay--fullscreen"
            contentLabel="Certificate Modal"
            onRequestClose={onRequestClose}
            shouldFocusAfterRender={false}
        >
            {isFilteringEnabled && (
                <div className="modal__info--upper">
                    <div className="modal__header--container">
                        <div className="modal__header">{translator.translate('adg_https')}</div>
                        <div className="modal__text modal__text--additional">{translator.translate('increase_ab_block_quality')}</div>
                    </div>
                    <Switcher
                        id={SWITCHER_IDS.HTTPS_SWITCHER}
                        checked={!certStatus.isInvalid && isHttpsFilteringEnabled && isHttps}
                        onClick={toggleHttpsFiltering}
                        isPageSecured={isPageSecured}
                        isDisabled={certStatus.isInvalid}
                    />
                </div>
            )}
            {!certStatus.isValid && CERT_STATES[originalCertStatus] && (
                <div className="modal__text modal__text--red modal__text--upper">
                    {translator.translate(CERT_STATES[originalCertStatus])}
                </div>
            )}
            <div className={lowerInfoClass}>
                {originalCertIssuer && (certStatus.isValid || certStatus.isInvalid)
                && (
                    <>
                        <div className="modal__text modal__text--notion">{translator.translate('verified_by')}</div>
                        <div className="modal__header modal__header--issuer">{originalCertIssuer}</div>
                        <div className="modal__text--container">
                            {certStatus.isInvalid && <div className="modal__text modal__text--red">Expired</div>}
                            <div
                                className="modal__text modal__text--link"
                                role="button"
                                tabIndex={uiStore.globalTabIndex}
                                onClick={showCert}
                                onKeyDown={handleKeyDown}
                            >
                                {translator.translate('more_info')}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
});

export default CertStatusModal;
