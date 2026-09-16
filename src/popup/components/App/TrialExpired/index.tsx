/**
 * @file Exports the trial expired notice view.
 */
import React, { useContext } from 'react';
import { observer } from 'mobx-react';

import rootStore from '../../../stores';
import { PURCHASE_TRIAL_EXPIRED } from '../../../../lib/consts';

import './TrialExpired.pcss';

const closePopup = () => window.close();

// Uses translationStore (not the shared browser.i18n translator) so the
// rendered language always matches the document lang attribute, which is
// derived from the same store.
const TrialExpired = observer(() => {
    const { translationStore } = useContext(rootStore);

    const { translate } = translationStore;

    return (
        <div className="trial-expired">
            <div className="trial-expired__title">
                {translate('popup_trial_expired_title')}
            </div>
            <div className="trial-expired__desc">
                <div>
                    {translate('popup_trial_expired_protection_disabled')}
                </div>
                <div>
                    {translate('popup_trial_expired_updates_unavailable')}
                </div>
            </div>
            <a
                href={PURCHASE_TRIAL_EXPIRED}
                target="_blank"
                rel="noopener noreferrer"
                className="button button--wide button--green"
                onClick={closePopup}
            >
                {translate('popup_trial_expired_purchase')}
            </a>
        </div>
    );
});

export default TrialExpired;
