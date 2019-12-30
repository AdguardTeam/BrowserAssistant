import React, { Fragment, useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import CertificateModal from './CertificateModal';
import SecurePageModal from './SecurePageModal';
import rootStore from '../../stores';
import { handleFocusOnce, invokeAfterDelay } from '../../helpers';
import './currentSite.pcss';
import { SHOW_MODAL_TIME } from '../../stores/consts';

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
        toggleCertStatusModal,
        isCertStatusModalOpen,
        isPageStatusModalOpen,
        setCanOpenPageStatusModalOnFocus,
        canOpenPageStatusModalOnFocus,
        setCanOpenCertModalOnFocus,
        canOpenCertModalOnFocus,
        securePageModalState,
        certStatus,
    } = uiStore;

    const closePageStatusModal = invokeAfterDelay(togglePageStatusModal);

    // eslint-disable-next-line no-unused-vars
    const autoClosePageStatusModal = invokeAfterDelay(togglePageStatusModal, SHOW_MODAL_TIME.SHORT);

    const onPageStatusFocus = handleFocusOnce(
        canOpenPageStatusModalOnFocus,
        togglePageStatusModal,
        closePageStatusModal
    );

    const onPageStatusBlur = () => {
        setCanOpenPageStatusModalOnFocus(false);
    };

    const closeCertStatusModal = invokeAfterDelay(toggleCertStatusModal);

    const onCertIconFocus = handleFocusOnce(
        canOpenCertModalOnFocus,
        toggleCertStatusModal,
        closeCertStatusModal
    );

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
            closeCertStatusModal();
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
                            onClick={httpsSite(toggleCertStatusModal)}
                            onKeyDown={onSpecificKeyDown(toggleCertStatusModal)}
                            onMouseOver={httpSite(toggleCertStatusModal)}
                            onMouseOut={httpSite(toggleCertStatusModal)}
                            onFocus={httpSite(onCertIconFocus)}
                            onBlur={httpSite(onCertIconBlur)}
                        >
                            {(isCertStatusModalOpen
                                || (!isHttps && isPageStatusModalOpen))
                            && <div className="arrow-up" />}
                        </div>
                    )}

                    <div className="current-site__name">
                        {currentTabHostname}
                    </div>

                    <CertificateModal
                        isOpen={isHttps && isCertStatusModalOpen}
                        onRequestClose={toggleCertStatusModal}
                        onAfterOpen={() => setTimeout(toggleCertStatusModal, SHOW_MODAL_TIME.LONG)}
                    />

                    <SecurePageModal
                        isOpen={(isPageSecured && isPageStatusModalOpen)
                        || (!isHttps && isCertStatusModalOpen)}
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
                onMouseOver={togglePageStatusModal}
                onMouseOut={togglePageStatusModal}
                onKeyDown={onSpecificKeyDown(togglePageStatusModal)}
                onFocus={onPageStatusFocus}
                onBlur={onPageStatusBlur}
            >
                secure page
            </div>
        </Fragment>
    );
});
export default CurrentSite;
