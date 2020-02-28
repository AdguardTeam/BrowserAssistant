import twoskyConfig from '../../.twosky.json';
import { flattenNestedObj } from '../lib/helpers';

const [{ languages }] = twoskyConfig;

const messagesMap = Object.keys(languages).reduce((acc, language) => {
    // eslint-disable-next-line global-require,import/no-dynamic-require
    const dictionary = require(`./${language}/messages.json`);
    acc[language] = flattenNestedObj(dictionary, 'message');
    return acc;
}, {});

export default messagesMap;
