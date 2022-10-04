import React from 'react';

import { translator } from '../../../../shared/translators/translator';
import { PURCHASE_TRIAL_EXPIRED } from '../../../../lib/consts';

import './TrialExpired.pcss';

const closePopup = () => window.close();

const TrialExpired = () => {
    return (
        <div className="trial-expired">
            <div className="trial-expired__title">
                {translator.getMessage('popup_trial_expired_title')}
            </div>
            <div className="trial-expired__desc">
                <div>
                    {translator.getMessage('popup_trial_expired_protection_disabled')}
                </div>
                <div>
                    {translator.getMessage('popup_trial_expired_updates_unavailable')}
                </div>
            </div>
            <a
                href={PURCHASE_TRIAL_EXPIRED}
                target="_blank"
                rel="noopener noreferrer"
                className="button button--wide button--green"
                onClick={closePopup}
            >
                {translator.getMessage('popup_trial_expired_purchase')}
            </a>
        </div>
    );
};

export default TrialExpired;
