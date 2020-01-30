import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import CertStatusModal from './CertStatusModal';
import SecureStatusModal from './SecureStatusModal';
import rootStore from '../../stores';
import { modalStatesNames, SHOW_MODAL_TIME } from '../../stores/consts';
import './currentSite.pcss';
import translator from '../../../lib/translator';

const CurrentSite = observer(() => {
    const { settingsStore, uiStore } = useContext(rootStore);
    const {
        isHttps,
        isHttpsFilteringEnabled,
        isFilteringEnabled,
        isPageSecured,
        currentTabHostname,
        originalCertIssuer,
    } = settingsStore;

    const {
        updateCertStatusModalState,
        resetCertStatusModalState,
        updateSecureStatusModalState,
        isCertStatusModalOpen,
        isPageStatusModalOpen,
        secureStatusModalInfo: {
            modalId, header, message, info,
        },
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
        'current-site__icon--checkmark': isPageSecured,
        'current-site__icon--lock': isHttps && certStatus.isValid,
        'current-site__icon--lock--yellow': isHttps && !isHttpsFilteringEnabled,
        'current-site__icon--warning--red': isHttps && certStatus.isInvalid,
        'current-site__icon--warning--yellow': isHttps && (certStatus.isBypassed || certStatus.isNotFound),
        'current-site__icon--warning--gray': !isHttps && !isPageSecured,
        'current-site__icon--warning': (isHttps && !certStatus.isValid) || (!isHttps && !isPageSecured),
        'current-site__icon--disabled-cursor': (!isFilteringEnabled && !certStatus.isValid) || !originalCertIssuer,
    });

    const securedClass = classNames({
        'current-site__title': true,
        'current-site__title--secured': isPageSecured,
    });

    const secureStatusClass = classNames({
        'current-site__secure-status': true,
        'current-site__secure-status--gray': isPageSecured || isFilteringEnabled,
        'current-site__secure-status--red': (isHttps && (!isFilteringEnabled || !certStatus.isValid)) || (!isHttps && !isPageSecured),
        'current-site__secure-status--modal': modalId,
    });

    const handleCertStatusModalState = (event, payload) => {
        if (!isFilteringEnabled && !certStatus.isValid) {
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
        <div className="current-site__container">
            <div className={securedClass}>
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
                    {!isPageSecured && ((isCertStatusModalOpen
                        && (!!originalCertIssuer || (!originalCertIssuer && isFilteringEnabled)))
                        || (!isHttps && isPageStatusModalOpen))
                    && <div className="arrow-up" />}
                </div>
                <div className="current-site__name">
                    {currentTabHostname}
                </div>

                <CertStatusModal
                    isOpen={isHttps && isCertStatusModalOpen
                    && (!!originalCertIssuer || (!originalCertIssuer && isFilteringEnabled))}
                    onRequestClose={resetCertStatusModalState}
                />
                <SecureStatusModal
                    isOpen={modalId
                    && ((isPageSecured && isPageStatusModalOpen)
                        || (!isHttps && (isPageStatusModalOpen || isCertStatusModalOpen)))}
                    message={message}
                    header={header}
                />
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
                {translator.translate(info)}
            </div>
        </div>
    );
});
export default CurrentSite;
