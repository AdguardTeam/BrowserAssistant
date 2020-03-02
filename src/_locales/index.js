import { flattenNestedObj } from '../lib/helpers';

const { LANGUAGES } = require('../../tasks/consts');

const messagesMap = Object.keys(LANGUAGES)
    .reduce((acc, language) => {
        // eslint-disable-next-line global-require,import/no-dynamic-require
        const dictionary = require(`./${language}/messages.json`);
        acc[language] = flattenNestedObj(dictionary, 'message');
        return acc;
    }, {});

export default messagesMap;
