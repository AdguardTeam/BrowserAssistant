import React, { useEffect } from 'react';

import { TermsAgreement } from '../../../shared/components/TermsAgreement';
import { translator } from '../../../shared/translators/translator';

export const App = () => {
    useEffect(() => {
        document.title = translator.getMessage('post_install_page_title');
    });

    return (
        <TermsAgreement />
    );
};
