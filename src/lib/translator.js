import { FormattedMessage } from 'react-intl';
import React from 'react';

const translate = (id) => <FormattedMessage id={id} />;

const translator = {
    translate,
};

export default translator;
