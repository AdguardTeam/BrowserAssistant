import { flattenNestedObj } from '../lib/helpers';

const { LANGUAGES, LOCALES_EQUIVALENTS_MAP } = require('../../tasks/langConstants');

const messagesMap = Object.keys(LANGUAGES)
    .reduce((acc, language) => {
        // eslint-disable-next-line global-require,import/no-dynamic-require
        const dictionary = require(`./${language}/messages.json`);
        const resultLocale = LOCALES_EQUIVALENTS_MAP[language] || language;
        acc[resultLocale.trim()] = flattenNestedObj(dictionary, 'message');
        return acc;
    }, {});

export default messagesMap;
