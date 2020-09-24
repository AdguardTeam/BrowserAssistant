import { flattenNestedObj } from '../lib/helpers';

const { LANGUAGES, FILENAME } = require('./langConstants');

const messagesMap = Object.keys(LANGUAGES)
    .reduce((acc, language) => {
        // eslint-disable-next-line global-require,import/no-dynamic-require
        const dictionary = require(`./${language}/${FILENAME}`);
        const lowerCasedLanguageKey = language.toLocaleLowerCase();
        acc[lowerCasedLanguageKey] = flattenNestedObj(dictionary, 'message');
        return acc;
    }, {});

export default messagesMap;
