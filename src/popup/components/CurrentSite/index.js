import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import CertificateModal from './CertificateModal';
import SecurePageModal from './SecurePageModal';
import rootStore from '../../stores';
import './currentSite.pcss';

const CurrentSite = observer(() => {
    const { settingsStore, uiStore } = useContext(rootStore);
    const {
        isExpired,
        isHttps,
        isHttpsFilteringEnabled,
        isFilteringEnabled,
        isPageSecured,
        currentTabHostname,
    } = settingsStore;

    const {
        toggleShowInfo,
        toggleOpenCertificateModal,
        isOpenCertificateModal,
        isSecureStatusHidden,
        securityModalState,
        isInfoHovered,
    } = uiStore;

    const handleShowInfo = () => toggleShowInfo();

    const toggleOpenAndResizeCertificateModal = () => {
        let bodyHeight = '32rem';

        if (isExpired && isHttps) {
            if (!isOpenCertificateModal) {
                bodyHeight = '44rem';
            }

            if (isOpenCertificateModal) {
                bodyHeight = '32rem';
            }
        }

        document.querySelector('body').style.height = bodyHeight;
        toggleOpenCertificateModal();
    };

    const iconClass = classNames({
        'current-site__icon': true,
        'current-site__icon--lock': isHttpsFilteringEnabled || !isFilteringEnabled,
        'current-site__icon--lock--danger': !isHttpsFilteringEnabled && isFilteringEnabled && isHttps,
        'current-site__icon--warning--http': !isHttps && !isPageSecured && !isHttps,
        'current-site__icon--warning--expired': !isHttpsFilteringEnabled && isFilteringEnabled && isHttps && isExpired,
        'current-site__icon--warning': (!isHttpsFilteringEnabled && isFilteringEnabled
            && isHttps && isExpired) || (!isHttps && !isPageSecured),
    });

    const expiredClass = classNames({
        'modal modal__certificate': true,
        'modal__certificate--expired': isExpired,
    });

    const securedClass = classNames({
        'current-site__title': true,
        'current-site__title--secured': isPageSecured,
    });

    const secureStatusClass = classNames({
        'current-site__secure-status': true,
        'current-site__secure-status--hidden': isSecureStatusHidden,
    });

    return (
        <div
            className="current-site__container"
        >
            <div className={securedClass}>
                {!isPageSecured && (
                    <button
                        type="button"
                        onClick={isFilteringEnabled
                            ? toggleOpenAndResizeCertificateModal : undefined}
                        className={iconClass}
                    >
                        {(isInfoHovered || isOpenCertificateModal)
                        && <div className="arrow-up" />}
                    </button>
                )}
                <div className="current-site__name">{currentTabHostname}</div>
                <CertificateModal
                    cn={expiredClass}
                    onRequestClose={toggleOpenAndResizeCertificateModal}
                    isOpen={isHttps && isOpenCertificateModal}
                />
                <div
                    onMouseOver={handleShowInfo}
                    onMouseLeave={handleShowInfo}
                    onFocus={handleShowInfo}
                    role="button"
                    tabIndex="-1"
                    className={secureStatusClass}
                >
                    secure page
                </div>
                <SecurePageModal
                    cn={securityModalState.cn}
                    message={securityModalState.message}
                    header={securityModalState.header}
                    isOpen={(isInfoHovered)
                    || (!isHttps && isOpenCertificateModal)
                    }
                    onRequestClose={() => {
                        if (isHttps) {
                            toggleShowInfo();
                        }
                        if (!isHttps) {
                            toggleOpenCertificateModal();
                        }
                    }}
                />
            </div>
        </div>
    );
});
export default CurrentSite;
