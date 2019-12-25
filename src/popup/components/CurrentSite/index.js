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
        isInfoHovered,
        securityModalState,
        certStatus,
    } = uiStore;


    const onInfoHovered = () => {
        toggleShowInfo();
    };

    const handleOpenCertificateModal = () => {
        toggleOpenCertificateModal();
    };

    const iconClass = classNames({
        'current-site__icon': true,
        'current-site__icon--lock': certStatus.isValid && (isHttpsFilteringEnabled || !isFilteringEnabled),
        'current-site__icon--lock--yellow': !isHttpsFilteringEnabled && isFilteringEnabled && isHttps,
        'current-site__icon--warning--gray': !isHttps && !isPageSecured && !isHttps,
        'current-site__icon--warning--red': isHttps && certStatus.isInvalid,
        'current-site__icon--warning--yellow': isHttps && (certStatus.isBypassed || certStatus.isNotFound),
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
        <div
            className="current-site__container"
        >
            <div
                className={securedClass}
            >
                {!isPageSecured && (
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
