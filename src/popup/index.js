import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import App from './components/App';
import './styles/main.pcss';
import log from '../lib/logger';
import { createGlobalActions } from '../lib/helpers';
import {
    API_TYPES, INNER_MESSAGING_TYPES, REQUEST_TYPES, TAB_ACTIONS,
} from '../lib/types';

try {
    global.adguard = {};
    createGlobalActions(adguard, REQUEST_TYPES,
        API_TYPES.requests, INNER_MESSAGING_TYPES.API_REQUEST);
    createGlobalActions(adguard, TAB_ACTIONS,
        API_TYPES.tabs, INNER_MESSAGING_TYPES.TAB_ACTION);

    ReactDOM.render(
        <Provider>
            <App />
        </Provider>,
        document.getElementById('root')
    );
} catch (error) {
    log.error(error);
}
