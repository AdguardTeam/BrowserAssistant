import React from 'react';
import cn from 'classnames';

import { browserApi } from '../../../lib/browserApi';
import { POST_INSTALL_MESSAGES } from '../../../lib/types';
import { translator } from '../../translators/translator';
import { reactTranslator } from '../../translators/reactTranslator';
import { DESKTOP_APPS_URL, PRIVACY_URL, TERMS_URL } from '../../../lib/consts';

import './terms-agreement.pcss';

export const ORIGIN = {
    POST_INSTALL: 'POST_INSTALL',
    POPUP: 'POPUP',
};

export const TermsAgreement = ({ origin = ORIGIN.POST_INSTALL, onAgreement = () => {} }) => {
    const handleAgreeClick = async () => {
        await browserApi.runtime.sendMessage({
            type: POST_INSTALL_MESSAGES.AGREE_WITH_CONDITIONS,
        });
        onAgreement();
    };

    const handleUninstallClick = async () => {
        // eslint-disable-next-line no-alert
        const confirmed = window.confirm(translator.getMessage('post_install_confirm_uninstall'));
        if (confirmed) {
            await browserApi.runtime.sendMessage({
                type: POST_INSTALL_MESSAGES.UNINSTALL_EXTENSION,
            });
        }
    };

    const containerClassName = cn('container-terms', {
        popup: origin === ORIGIN.POPUP,
        'post-install': origin === ORIGIN.POST_INSTALL,
    });

    return (
        <div className={containerClassName}>
            <h1 className="title">
                {reactTranslator.getMessage('post_install_consent_title')}
            </h1>
            <div className="description">
                <p>
                    {reactTranslator.getMessage('post_install_consent_short_app_desc', {
                        link: (chunks) => (
                            <a
                                href={DESKTOP_APPS_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {chunks}
                            </a>
                        ),
                    })}
                </p>
                <p>
                    {reactTranslator.getMessage('post_install_consent_sent_info_desc')}
                </p>
                <p>
                    {reactTranslator.getMessage('post_install_consent_policy_urls', {
                        privacy: (chunks) => (
                            <a
                                href={PRIVACY_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {chunks}
                            </a>
                        ),
                        terms: (chunks) => (
                            <a
                                href={TERMS_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {chunks}
                            </a>
                        ),
                    })}
                </p>
            </div>
            <div className="controls">
                <button
                    className="controls__btn button button--middle button--green"
                    type="button"
                    onClick={handleAgreeClick}
                >
                    {reactTranslator.getMessage('post_install_page_agree_button')}
                </button>
                <button
                    className="controls__btn button button--middle button--transparent"
                    type="button"
                    onClick={handleUninstallClick}
                >
                    {reactTranslator.getMessage('post_install_page_uninstall_button')}
                </button>
            </div>
        </div>
    );
};
