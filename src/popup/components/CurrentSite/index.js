import React, { useEffect, useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import CertificateModal from './CertificateModal';
import SecurePageModal from './SecurePageModal';
import rootStore from '../../stores';
import './currentSite.pcss';

const CurrentSite = observer(() => {
    const { settingsStore, uiStore } = useContext(rootStore);
    console.log('STAT', settingsStore.filteringStatus);

    useEffect(() => {
        (async () => {
            await settingsStore.getCurrentTabHostname();
        })();
    });

    const toggleShowInfo = () => uiStore.toggleShowInfo();
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
        HTTP: {
            cn: 'modal modal__secure-page',
            message: 'Nothing to block here',
        },
        HTTPS: {
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
        'current-site__secure-status--hidden': uiStore.isOpenCertificateModal,
    });

    return (
        <div
            className="current-site__container"
        >
            <div className={securedClass}>
                {!settingsStore.isPageSecured && (
                    <button
                        type="button"
                        onClick={toggleOpenAndResizeCertificateModal}
                        className={iconClass}
                    />
                )}
                <div className="current-site__name">{settingsStore.currentTabHostname}</div>
                <CertificateModal
                    cn={expiredClass}
                    onRequestClose={toggleOpenAndResizeCertificateModal}
                />
                {(settingsStore.isPageSecured
                    || (!settingsStore.isExpired && settingsStore.isHttpsFilteringEnabled)) && (
                    // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
                    <div
                        onMouseOver={toggleShowInfo}
                        onMouseLeave={toggleShowInfo}
                        role="button"
                        tabIndex="0"
                        className={secureStatusClass}
                    >
                        secure page
                    </div>
                )}
                {uiStore.isInfoHovered && (
                <SecurePageModal
                    isOpen
                    cn={securityModalState[settingsStore.filteringStatus].cn}
                    message={securityModalState[settingsStore.filteringStatus].message}
                />
                )}
            </div>
        </div>
    );
});
export default CurrentSite;
