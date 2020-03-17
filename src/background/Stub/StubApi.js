/**
 * Stub for the native application API.
 * It is used for debugging purposes only.
 */

import nanoid from 'nanoid';
import {
    ASSISTANT_TYPES,
    MESSAGE_TYPES,
    REQUEST_TYPES,
    RESPONSE_TYPE_PREFIXES,
} from '../../lib/types';
import browserApi from '../../lib/browserApi';
import versions from '../versions';
import log from '../../lib/logger';
import stubHost from './StubHost';

const { BASE_LOCALE } = require('../../../tasks/consts');

class Api {
    isAppUpToDate = true;

    isExtensionUpdated = true;

    locale = BASE_LOCALE;

    responsesHandler = (params) => {
        log.info(`params ${params.id}`, params);

        // Ignore requests without identifying prefix ADG
        if (!params.requestId.startsWith(RESPONSE_TYPE_PREFIXES.ADG)) {
            return;
        }

        browserApi.runtime.sendMessage({
            type: params.result.toUpperCase(),
            params,
        });
    };

    init = async () => {
        try {
            const res = await this.makeRequest({
                type: REQUEST_TYPES.init,
                parameters: {
                    ...versions,
                    type: ASSISTANT_TYPES.nativeAssistant,
                },
            });

            const { parameters, appState } = res;

            this.isAppUpToDate = (versions.apiVersion <= parameters.apiVersion);
            this.isExtensionUpdated = parameters.isValidatedOnHost;
            this.locale = appState.locale;

            if (!this.isAppUpToDate || !this.isExtensionUpdated) {
                await browserApi.runtime.sendMessage({
                    type: MESSAGE_TYPES.SHOW_SETUP_INCORRECT,
                });
            }
        } catch (error) {
            log.error(error);
        }
    };

    makeRequest = async (params) => {
        const id = `${RESPONSE_TYPE_PREFIXES.ADG}_${nanoid()}`;

        log.info(`request ${id}`, params);

        const request = { id, ...params };
        const response = await stubHost.getStubResponse(request);

        this.responsesHandler(response);
        return response;
    };
}

const api = new Api();

export default api;
