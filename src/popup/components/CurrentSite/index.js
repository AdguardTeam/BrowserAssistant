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

    const onOpenCertModal = () => {
        toggleOpenCertificateModal();
    };

    const onKeyboardOpenCertModal = (e) => {
        if (e.key === 'Enter') {
            onOpenCertModal();
        }
    };

    const onlyHttps = (handler) => {
        return (isHttps && isFilteringEnabled) ? handler : undefined;
    };

    const onlyHttp = (handler) => {
        return (!isHttps && isFilteringEnabled) ? handler : undefined;
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
                        tabIndex={uiStore.globalTabIndex}
                        onClick={onlyHttps(onOpenCertModal)}
                        onKeyDown={onlyHttps(onKeyboardOpenCertModal)}
                        onMouseOver={onlyHttp(onInfoHovered)}
                        onMouseOut={onlyHttp(onInfoHovered)}
                        className={iconClass}
                    >
                        {(isOpenCertificateModal || (!isHttps && isInfoHovered))
                            && <div className="arrow-up" />}
                    </div>
                    )}

                    <div className="current-site__name">
                        {currentTabHostname}
                    </div>

                    <CertificateModal
                        onRequestClose={onOpenCertModal}
                        isOpen={isHttps && isOpenCertificateModal}
                    />
                    <SecurePageModal
                        cn={securityModalState.cn}
                        message={securityModalState.message}
                        isOpen={isInfoHovered || (!isHttps && isOpenCertificateModal)}
                        header={securityModalState.header}
                    />
                </div>
            </div>
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
        </Fragment>
    );
});
export default CurrentSite;
