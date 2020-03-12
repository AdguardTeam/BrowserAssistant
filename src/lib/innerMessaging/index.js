import { INNER_MESSAGE_TYPES } from '../types';
import browserApi from '../browserApi';

export default Object.values(INNER_MESSAGE_TYPES)
    .reduce((acc, type) => {
        acc[type] = async (params) => {
            await browserApi.runtime.sendMessage({
                type,
                params,
            });
        };
        return acc;
    }, {});
