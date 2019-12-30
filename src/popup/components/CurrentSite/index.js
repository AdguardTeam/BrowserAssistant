import React, { Fragment, useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import CertificateModal from './CertificateModal';
import SecurePageModal from './SecurePageModal';
import rootStore from '../../stores';
import './currentSite.pcss';

const CurrentSite = observer(() => {
    const { settingsStore, uiStore } = useContext(rootStore);
    const {
        isHttps,
        isHttpsFilteringEnabled,
        isFilteringEnabled,
        isPageSecured,
        currentTabHostname,
    } = settingsStore;

    const {
        togglePageStatusModal,
        toggleCertificateModal,
        isCertificateModalOpen,
        isPageStatusModalOpen,
        setCanOpenPageStatusModalOnFocus,
        canOpenPageStatusModalOnFocus,
        setCanOpenCertModalOnFocus,
        canOpenCertModalOnFocus,
        securePageModalState,
        certStatus,
    } = uiStore;


    const handlePageStatusModal = () => {
        togglePageStatusModal();
    };

    const closePageStatusModal = () => {
        setTimeout(togglePageStatusModal, 2000);
    };

    const onPageStatusFocus = () => {
        if (canOpenPageStatusModalOnFocus) {
            handlePageStatusModal();
            setTimeout(handlePageStatusModal, 2000);
        }
    };

    const onPageStatusBlur = () => {
        setCanOpenPageStatusModalOnFocus(false);
    };


    const handleCertModal = () => {
        toggleCertificateModal();
    };

    const closeCertModal = () => {
        setTimeout(toggleCertificateModal, 2000);
    };

    const autoCloseCertModal = () => {
        setTimeout(toggleCertificateModal, 10000);
    };

    const onCertIconFocus = () => {
        if (canOpenCertModalOnFocus) {
            handleCertModal();
            setTimeout(handleCertModal, 2000);
        }
    };

    const onCertIconBlur = () => {
        setCanOpenCertModalOnFocus(false);
    };


    const onSpecificKeyDown = (handler, specificKey = 'Enter') => (e) => {
        if (e.key === specificKey) {
            return handler();
        }
        return undefined;
    };

    const httpsSite = (handler) => {
        return (isHttps && isFilteringEnabled) ? handler : undefined;
    };

    const httpSite = (handler) => {
        return (!isHttps && isFilteringEnabled) ? handler : undefined;
    };

    const onAfterOpen = () => {
        if (isPageSecured && !canOpenPageStatusModalOnFocus) {
            closePageStatusModal();
            return;
        }
        if (!isHttps && !canOpenCertModalOnFocus) {
            closeCertModal();
        }
    };

    const iconClass = classNames({
        'current-site__icon': true,
        'current-site__icon--lock': isHttps && certStatus.isValid,
        'current-site__icon--lock--yellow': isHttps && !isHttpsFilteringEnabled,
        'current-site__icon--warning--red': isHttps && certStatus.isInvalid,
        'current-site__icon--warning--yellow': isHttps && (certStatus.isBypassed || certStatus.isNotFound),
        'current-site__icon--warning--gray': !isHttps && !isPageSecured,
        'current-site__icon--warning': (isHttps && !certStatus.isValid) || (!isHttps && !isPageSecured),
        'current-site__icon--disabled-cursor': !isFilteringEnabled,
    });

    const securedClass = classNames({
        'current-site__title': true,
        'current-site__title--secured': isPageSecured,
    });

    const secureStatusClass = classNames({
        'current-site__secure-status': true,
        'current-site__secure-status--hidden': !isPageSecured,
    });

    return (
        <Fragment>
            <div className="current-site__container">
                <div className={securedClass}>
                    {!isPageSecured && (
                        <div
                            role="menu"
                            className={iconClass}
                            tabIndex={uiStore.globalTabIndex}
                            onClick={httpsSite(handleCertModal)}
                            onKeyDown={onSpecificKeyDown(handleCertModal)}
                            onMouseOver={httpSite(handleCertModal)}
                            onMouseOut={httpSite(handleCertModal)}
                            onFocus={httpSite(onCertIconFocus)}
                            onBlur={httpSite(onCertIconBlur)}
                        >
                            {(isCertificateModalOpen
                                || (!isHttps && isPageStatusModalOpen))
                            && <div className="arrow-up" />}
                        </div>
                    )}

                    <div className="current-site__name">
                        {currentTabHostname}
                    </div>

                    <CertificateModal
                        isOpen={isHttps && isCertificateModalOpen}
                        onRequestClose={handleCertModal}
                        onAfterOpen={autoCloseCertModal}
                    />

                    <SecurePageModal
                        isOpen={(isPageSecured && isPageStatusModalOpen)
                        || (!isHttps && isCertificateModalOpen)}
                        cn={securePageModalState.cn}
                        message={securePageModalState.message}
                        header={securePageModalState.header}
                        onAfterOpen={onAfterOpen}
                    />
                </div>
            </div>
            <div
                role="menu"
                tabIndex={uiStore.globalTabIndex}
                className={secureStatusClass}
                onMouseOver={handlePageStatusModal}
                onMouseOut={handlePageStatusModal}
                onKeyDown={onSpecificKeyDown(handlePageStatusModal)}
                onFocus={onPageStatusFocus}
                onBlur={onPageStatusBlur}
            >
                secure page
            </div>
        </Fragment>
    );
});
export default CurrentSite;
