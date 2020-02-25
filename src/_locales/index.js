import languages from './languages';
import { flat } from '../lib/helpers';

const messagesMap = Object.entries(languages)
    .reduce((acc, [key, value]) => {
        acc[key] = flat(value, 'message');
        return acc;
    }, {});

export default messagesMap;
