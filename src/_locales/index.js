import { flattenNestedObj } from '../lib/helpers';

const { LANGUAGES } = require('../../tasks/consts');
const { getEquivalent } = require('../../tasks/locales');

const messagesMap = Object.keys(LANGUAGES)
    .reduce((acc, language) => {
        const resultLocale = getEquivalent(language);
        // eslint-disable-next-line global-require,import/no-dynamic-require
        const dictionary = require(`./${resultLocale}/messages.json`);
        acc[language] = flattenNestedObj(dictionary, 'message');
        return acc;
    }, {});

export default messagesMap;
