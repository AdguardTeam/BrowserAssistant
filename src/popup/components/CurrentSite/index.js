import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import CertStatusModal from './CertStatusModal';
import SecureStatusModal from './SecureStatusModal';
import rootStore from '../../stores';
import {
    MODAL_STATES_NAMES,
    SHOW_MODAL_TIME,
} from '../../stores/consts';
import './currentSite.pcss';

const CurrentSite = observer(() => {
    const { settingsStore, uiStore, translationStore } = useContext(rootStore);
    const {
        pageProtocol,
        isHttpsFilteringEnabled,
        isFilteringEnabled,
        originalCertIssuer,
        pageInfo,
        shouldShowFilteringPauseTimer,
        filteringPauseTimer,
        reloadCurrentTab,
        showReloadButtonFlag,
        setShowReloadButtonFlag,
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

    const {
        translate,
    } = translationStore;

    const getHandlerForHttpsSite = (handler) => {
        if (pageProtocol.isHttps) {
            return handler;
        }
        return undefined;
    };

    const getHandlerForHttpSite = (handler) => {
        if (!pageProtocol.isHttps) {
            return handler;
        }
        return undefined;
    };

    const iconClass = classNames('current-site__icon', {
        'current-site__icon--checkmark': pageProtocol.isSecured,
        'current-site__icon--lock': pageProtocol.isHttps && !certStatus.isInvalid,
        'current-site__icon--lock--yellow': pageProtocol.isHttps && !isHttpsFilteringEnabled,
        'current-site__icon--warning--red': pageProtocol.isHttps && certStatus.isInvalid,
        'current-site__icon--warning--gray': pageProtocol.isHttp,
        'current-site__icon--warning': (pageProtocol.isHttps && certStatus.isInvalid) || pageProtocol.isHttp,
    });

    const securedClass = classNames('current-site__title', {
        'current-site__title--secured': pageProtocol.isSecured,
    });

    const secureStatusClass = classNames('current-site__secure-status', {
        'current-site__secure-status--gray': pageProtocol.isSecured || isFilteringEnabled,
        'current-site__secure-status--red': (pageProtocol.isHttps && (!isFilteringEnabled || certStatus.isInvalid))
            || pageProtocol.isHttp,
        'current-site__secure-status--modal': modalId,
    });

    const timerClass = classNames('timer', { 'timer--hidden': !shouldShowFilteringPauseTimer });

    const handleCertStatusModalState = (event, payload) => {
        updateCertStatusModalState(event.type, payload);
    };

    const onKeyEnterDown = (event) => {
        if (isFilteringEnabled && event.key !== 'Enter') {
            return;
        }
        handleCertStatusModalState(event);
        event.persist();
        setTimeout(() => handleCertStatusModalState(event,
            { [MODAL_STATES_NAMES.isEntered]: false }), SHOW_MODAL_TIME.LONG);
    };

    const handleSecureStatusModalState = (event, payload) => {
        return updateSecureStatusModalState(event.type, payload);
    };

    const handlePageReload = () => {
        reloadCurrentTab();
        setShowReloadButtonFlag(false);
    };

    const onKeyEnterDownSecure = (event) => {
        if (event.key !== 'Enter') {
            return;
        }
        handleSecureStatusModalState(event);
        event.persist();
        setTimeout(() => handleSecureStatusModalState(event,
            { [MODAL_STATES_NAMES.isEntered]: false }), SHOW_MODAL_TIME.SHORT);
    };

    const shouldOpenCertStatusModal = (isCertStatusModalOpen
        && (!!originalCertIssuer
            || (!originalCertIssuer && isFilteringEnabled)
        )
    );

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
                    {!pageProtocol.isSecured
                        && (shouldOpenCertStatusModal
                            || (!pageProtocol.isHttps
                                && (isPageStatusModalOpen || isCertStatusModalOpen)))
                    && <div className="arrow-up" />}
                </div>
                <h2 tabIndex={uiStore.globalTabIndex} className="current-site__name">
                    {pageInfo}
                </h2>
                <CertStatusModal
                    isOpen={pageProtocol.isHttps && shouldOpenCertStatusModal}
                    onRequestClose={resetCertStatusModalState}
                />
                <SecureStatusModal
                    isOpen={modalId
                    && ((pageProtocol.isSecured && isPageStatusModalOpen)
                        || (!pageProtocol.isHttps
                            && (isPageStatusModalOpen || isCertStatusModalOpen))
                    )}
                    message={message}
                    header={header}
                />
            </div>
            {showReloadButtonFlag
                ? <div className="current-site__secure-status">{translate('reload_to_resume_filtering')}</div>
                : (
                    <div
                        role="status"
                        tabIndex={uiStore.globalTabIndex}
                        className={secureStatusClass}
                        onMouseOver={handleSecureStatusModalState}
                        onMouseOut={handleSecureStatusModalState}
                        onKeyDown={onKeyEnterDownSecure}
                        onFocus={handleSecureStatusModalState}
                        onBlur={handleSecureStatusModalState}
                    >
                        {translate(info)}
                    </div>
                )}
            {showReloadButtonFlag
                ? (
                    <button
                        onClick={handlePageReload}
                        type="button"
                        className="reload-button"
                        title={translate('reload_page')}
                    >
                        <figure className="reload-button__figure">
                            <figcaption>{translate('reload_page')}</figcaption>
                        </figure>
                    </button>
                )
                : <time className={timerClass}>{filteringPauseTimer}</time>}
        </div>
    );
});
export default CurrentSite;
