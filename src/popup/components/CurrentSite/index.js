import React, { Fragment, useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import CertificateModal from './CertificateModal';
import SecurePageModal from './SecurePageModal';
import rootStore from '../../stores';
import { SHOW_MODAL_TIME } from '../../stores/consts';
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
        updateCertStatusModalState,
        updateSecureStatusModalState,
        isCertStatusModalOpen,
        isPageStatusModalOpen,
        securePageModalState,
        certStatus,
    } = uiStore;

    const isFilteringEnabledOnSite = (handler) => {
        if (isFilteringEnabled) {
            return handler;
        }
        return undefined;
    };

    const isHttpsSite = (handler) => {
        if (isHttps && isFilteringEnabled) {
            return handler;
        }
        return undefined;
    };

    const isHttpSite = (handler) => {
        if (!isHttps && isFilteringEnabled) {
            return handler;
        }
        return undefined;
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

    const handleCertStatusModalState = (event, payload) => {
        return updateCertStatusModalState(event.type, payload);
    };

    const onKeyEnterDown = (event) => {
        if (event.key !== 'Enter') {
            return;
        }
        handleCertStatusModalState(event);
        event.persist();
        setTimeout(() => handleCertStatusModalState(event,
            { isEntered: false }), SHOW_MODAL_TIME.LONG);
    };

    const handleSecureStatusModalState = (event, payload) => {
        return updateSecureStatusModalState(event.type, payload);
    };

    const onKeyEnterDownSecure = (event) => {
        if (event.key !== 'Enter') {
            return;
        }
        handleSecureStatusModalState(event);
        event.persist();
        setTimeout(() => handleSecureStatusModalState(event,
            { isEntered: false }), SHOW_MODAL_TIME.SHORT);
    };

    const onBlur = () => handleCertStatusModalState('blur',
        { isFocused: false });

    return (
        <Fragment>
            <div className="current-site__container">
                <div className={securedClass}>
                    {!isPageSecured && (
                        <div
                            role="menu"
                            className={iconClass}
                            tabIndex={uiStore.globalTabIndex}
                            onKeyDown={isFilteringEnabledOnSite(onKeyEnterDown)}
                            onMouseOver={isHttpSite(handleCertStatusModalState)}
                            onMouseOut={isHttpSite(handleCertStatusModalState)}
                            onFocus={handleCertStatusModalState}
                            onBlur={isHttpSite(handleCertStatusModalState)}
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
                        onRequestClose={isHttpsSite(onBlur)}
                    />

                    <SecurePageModal
                        isOpen={(isPageSecured && isPageStatusModalOpen)
                        || (!isHttps && isCertStatusModalOpen)}
                        cn={securePageModalState.cn}
                        message={securePageModalState.message}
                        header={securePageModalState.header}
                    />
                </div>
            </div>
            <div
                role="menu"
                tabIndex={uiStore.globalTabIndex}
                className={secureStatusClass}
                onMouseOver={handleSecureStatusModalState}
                onMouseOut={handleSecureStatusModalState}
                onKeyDown={onKeyEnterDownSecure}
                onFocus={handleSecureStatusModalState}
                onBlur={handleSecureStatusModalState}
            >
                secure page
            </div>
        </Fragment>
    );
});
export default CurrentSite;
