import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Modal from 'react-modal';
import classNames from 'classnames';
import Switcher from '../../Settings/Switcher';
import rootStore from '../../../stores';
import { SWITCHER_IDS, CERT_STATES } from '../../../stores/consts';
import './modal.pcss';

const CertStatusModal = observer(({ onRequestClose, isOpen }) => {
    const { settingsStore, uiStore, translationStore } = useContext(rootStore);
    const {
        setHttpsFiltering,
        isHttpsFilteringEnabled,
        originalCertIssuer,
        pageProtocol,
        originalCertStatus,
        isAuthorized,
        openOriginalCert,
    } = settingsStore;

    const {
        certStatus,
        globalTabIndex,
    } = uiStore;

    const { translate } = translationStore;

    const toggleHttpsFiltering = async () => {
        if (!certStatus.isInvalid) {
            await setHttpsFiltering(!isHttpsFilteringEnabled);
        }
    };

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter') {
            await openOriginalCert();
        }
    };

    const modalClass = classNames({
        'modal modal__cert-status': true,
        'modal__cert-status--small': certStatus.isNotFound || certStatus.isBypassed
            || (certStatus.isInvalid && !originalCertIssuer),
        'modal__cert-status--large': certStatus.isInvalid && originalCertIssuer,
        // This case can happen only as result of host mistake
        'modal__cert-status--tiny': certStatus.isValid && !originalCertIssuer,
    });

    const lowerInfoClass = classNames({
        'modal__info--lower': certStatus.isValid,
        'modal__info--lower--no-padding': certStatus.isInvalid,
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
            <div className="modal__info--upper">
                <div className="modal__header--container">
                    <div className="modal__header">{translate('https_filtering')}</div>
                    <div className="modal__text modal__text--additional">{translate('increase_ab_block_quality')}</div>
                </div>
                <Switcher
                    id={SWITCHER_IDS.HTTPS_SWITCHER}
                    checked={!certStatus.isInvalid && pageProtocol.isHttps
                        && isHttpsFilteringEnabled}
                    onClick={toggleHttpsFiltering}
                    isDisabled={certStatus.isInvalid || !isAuthorized}
                    label={translate('https_filtering')}
                />
            </div>
            {!certStatus.isValid && CERT_STATES[originalCertStatus] && (
                <div className="modal__text modal__text--red modal__text--upper">
                    {translate(CERT_STATES[originalCertStatus])}
                </div>
            )}
            <div className={lowerInfoClass}>
                {originalCertIssuer && (certStatus.isValid || certStatus.isInvalid)
                && (
                    <>
                        <div className="modal__text modal__text--notion">{translate('verified_by')}</div>
                        <div className="modal__header modal__header--issuer">{originalCertIssuer}</div>
                        <div className="modal__text--container">
                            {certStatus.isInvalid
                                && (
                                    <div className="modal__text modal__text--red modal__text--expired">
                                        {translate('expired')}
                                    </div>
                                )}
                            <div
                                className="modal__text modal__text--link"
                                role="button"
                                tabIndex={globalTabIndex}
                                onClick={openOriginalCert}
                                onKeyDown={handleKeyDown}
                            >
                                {translate('more_info')}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
});

export default CertStatusModal;
