import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import CertificateModal from './CertificateModal';
import SecurePageModal from './SecurePageModal';
import rootStore from '../../stores';
import './currentSite.pcss';

const CurrentSite = observer(() => {
    const { settingsStore, uiStore } = useContext(rootStore);

    const toggleShowInfo = () => uiStore.toggleShowInfo();
    const toggleShowInfoFocus = () => {
        uiStore.toggleShowInfo();
        setTimeout(() => uiStore.toggleShowInfo(), 5000);
    };
    const toggleOpenAndResizeCertificateModal = () => {
        let bodyHeight = '32rem';

        if (settingsStore.isExpired) {
            if (!uiStore.isOpenCertificateModal) {
                bodyHeight = '44rem';
            }
            if (uiStore.isOpenCertificateModal) {
                bodyHeight = '32rem';
            }
        }

        document.querySelector('body').style.height = bodyHeight;
        return uiStore.toggleOpenCertificateModal();
    };

    const securityModalState = {
        HTTPS: {
            cn: 'modal modal__secure-page',
            message: 'Nothing to block here',
        },
        HTTP: {
            cn: 'modal modal__secure-page modal__secure-page--bank',
            message: `By default, we don't filter HTTPS traffic for the payment system and bank websites.
            You can enable the filtering yourself: tap on the yellow 'lock' on the left.`,
        },
    };


    const iconClass = classNames({
        'current-site__icon': true,
        'current-site__icon--warning': settingsStore.isExpired,
        'current-site__icon--lock-danger': !settingsStore.isHttpsFilteringEnabled,
        'current-site__icon--lock': settingsStore.isHttpsFilteringEnabled,
    });

    const expiredClass = classNames({
        'modal modal__certificate': true,
        'modal__certificate--expired': settingsStore.isExpired,
    });

    const securedClass = classNames({
        'current-site__title': true,
        'current-site__title--secured': settingsStore.isPageSecured,
    });

    const secureStatusClass = classNames({
        'current-site__secure-status': true,
        'current-site__secure-status--hidden': uiStore.isSecureStatusHidden,
    });

    return (
        <div
            className="current-site__container"
        >
            <div className={securedClass}>
                {(!settingsStore.isPageSecured && settingsStore.isFilteringEnabled) && (
                    <button
                        type="button"
                        onClick={toggleOpenAndResizeCertificateModal}
                        className={iconClass}
                    >
                        {(settingsStore.isInfoHovered || uiStore.isOpenCertificateModal) && <div className="arrow-up" />}
                    </button>
                )}
                <div className="current-site__name">{settingsStore.currentTabHostname}</div>
                <CertificateModal
                    cn={expiredClass}
                    onRequestClose={toggleOpenAndResizeCertificateModal}
                />
                <div
                    onMouseOver={toggleShowInfo}
                    onMouseLeave={toggleShowInfo}
                    onFocus={toggleShowInfoFocus}
                    role="button"
                    tabIndex="0"
                    className={secureStatusClass}
                >
                    secure page
                </div>
                {uiStore.isInfoHovered && (
                    <SecurePageModal
                        cn={securityModalState[settingsStore.filteringStatus].cn}
                        message={securityModalState[settingsStore.filteringStatus].message}
                    />
                )}
            </div>
        </div>
    );
});
export default CurrentSite;
