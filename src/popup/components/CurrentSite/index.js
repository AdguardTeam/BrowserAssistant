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
        isInfoHovered,
        securityModalState,
    } = uiStore;


    const onInfoHovered = () => {
        toggleShowInfo();
    };

    const handleOpenCertificateModal = () => {
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
        'current-site__icon--disabled-cursor': !isFilteringEnabled,
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
            <div
                className={securedClass}
            >
                {!isPageSecured && (
                    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                    <button
                        type="button"
                        onClick={(isHttps && isFilteringEnabled)
                            ? handleOpenCertificateModal : undefined}
                        onMouseOver={(!isHttps && isFilteringEnabled) ? onInfoHovered : undefined}
                        onMouseOut={(!isHttps && isFilteringEnabled) ? onInfoHovered : undefined}
                        className={iconClass}
                    >
                        {(isOpenCertificateModal || (!isHttps && isInfoHovered))
                        && <div className="arrow-up" />}
                    </button>
                )}

                <div className="current-site__name">
                    {currentTabHostname}
                </div>

                <CertificateModal
                    cn={expiredClass}
                    onRequestClose={handleOpenCertificateModal}
                    isOpen={isHttps && isOpenCertificateModal}
                />

                {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
                <div
                    role="button"
                    tabIndex="-1"
                    className={secureStatusClass}
                    onMouseOver={onInfoHovered}
                    onMouseOut={onInfoHovered}
                >
                        secure page
                </div>

                <SecurePageModal
                    cn={securityModalState.cn}
                    message={securityModalState.message}
                    isOpen={isInfoHovered || (!isHttps && isOpenCertificateModal)}
                    header={securityModalState.header}
                />

            </div>
        </div>
    );
});
export default CurrentSite;
