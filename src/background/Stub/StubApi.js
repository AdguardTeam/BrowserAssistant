/**
 * Stub for the native application API.
 * It is used for debugging purposes only.
 */

import nanoid from 'nanoid';
import {
    ASSISTANT_TYPES,
    REQUEST_TYPES,
    RESPONSE_TYPE_PREFIXES,
} from '../../lib/types';
import browserApi from '../browserApi';
import versions from '../versions';
import log from '../../lib/logger';
import stubHost from './StubHost';

class Api {
    isAppUpToDate = true;

    isExtensionUpdated = true;

    responsesHandler = (response) => {
        log.info(`response ${response.id}`, response);
        const { parameters } = response;

        // Ignore requests without identifying prefix ADG
        if (!response.requestId.startsWith(RESPONSE_TYPE_PREFIXES.ADG)) {
            return;
        }

        if (parameters && response.requestId.startsWith(RESPONSE_TYPE_PREFIXES.ADG_INIT)) {
            this.isAppUpToDate = (versions.apiVersion <= parameters.apiVersion);
            adguard.isAppUpToDate = this.isAppUpToDate;

            this.isExtensionUpdated = parameters.isValidatedOnHost;
            adguard.isExtensionUpdated = this.isExtensionUpdated;
        }

        browserApi.runtime.sendMessage({ msgType: response.result, response });
    };

    init = async () => {
        try {
            await this.makeRequest({
                type: REQUEST_TYPES.init,
                parameters: {
                    ...versions,
                    type: ASSISTANT_TYPES.nativeAssistant,
                },
            }, RESPONSE_TYPE_PREFIXES.ADG_INIT);
        } catch (error) {
            log.error(error);
        }
    };

    makeRequest = async (params, idPrefix = RESPONSE_TYPE_PREFIXES.ADG) => {
        const id = `${idPrefix}_${nanoid()}`;

        log.info(`request ${id}`, params);

        const request = { id, ...params };
        const response = await stubHost.getStubResponse(request);

        this.responsesHandler(response);
        return response;
    };
}

const api = new Api();

export default api;
