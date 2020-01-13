import React, { Fragment, useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import CertStatusModal from './CertStatusModal';
import SecureStatusModal from './SecureStatusModal';
import rootStore from '../../stores';
import { modalStatesNames, SHOW_MODAL_TIME } from '../../stores/consts';
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
        resetCertStatusModalState,
        updateSecureStatusModalState,
        isCertStatusModalOpen,
        isPageStatusModalOpen,
        secureStatusModalInfo,
        certStatus,
    } = uiStore;

    const getHandlerForHttpsSite = (handler) => {
        if (isHttps) {
            return handler;
        }
        return undefined;
    };

    const getHandlerForHttpSite = (handler) => {
        if (!isHttps) {
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
        if (!isFilteringEnabled) {
            return;
        }
        updateCertStatusModalState(event.type, payload);
    };

    const onKeyEnterDown = (event) => {
        if (isFilteringEnabled && event.key !== 'Enter') {
            return;
        }
        handleCertStatusModalState(event);
        event.persist();
        setTimeout(() => handleCertStatusModalState(event,
            { [modalStatesNames.isEntered]: false }), SHOW_MODAL_TIME.LONG);
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
            { [modalStatesNames.isEntered]: false }), SHOW_MODAL_TIME.SHORT);
    };

    return (
        <Fragment>
            <div className="current-site__container">
                <div className={securedClass}>
                    {!isPageSecured && (
                        <div
                            role="menu"
                            className={iconClass}
                            tabIndex={uiStore.globalTabIndex}
                            onKeyDown={onKeyEnterDown}
                            onMouseDown={getHandlerForHttpsSite(handleCertStatusModalState)}
                            onFocus={handleCertStatusModalState}
                            onBlur={handleCertStatusModalState}
                            onMouseOver={getHandlerForHttpSite(handleCertStatusModalState)}
                            onMouseOut={getHandlerForHttpSite(handleCertStatusModalState)}
                        >
                            {(isCertStatusModalOpen
                                || (!isHttps && isPageStatusModalOpen))
                            && <div className="arrow-up" />}
                        </div>
                    )}

                    <div className="current-site__name">
                        {currentTabHostname}
                    </div>

                    <CertStatusModal
                        isOpen={isHttps && isCertStatusModalOpen}
                        onRequestClose={resetCertStatusModalState}
                    />

                    <SecureStatusModal
                        isOpen={(isPageSecured && isPageStatusModalOpen)
                        || (!isHttps && isCertStatusModalOpen)}
                        message={secureStatusModalInfo.message}
                        header={secureStatusModalInfo.header}
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
