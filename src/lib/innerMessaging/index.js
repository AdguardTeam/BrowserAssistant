import { MESSAGE_TYPES } from '../types';
import browserApi from '../browserApi';

export default Object.values(MESSAGE_TYPES)
    .reduce((acc, type) => {
        acc[type] = (params) => browserApi.runtime.sendMessage({
            type,
            params,
        });
        return acc;
    }, {});
