import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';

import App from './components/App';
import log from '../lib/logger';
import ErrorBoundary from './components/ErrorBoundary';
import '../shared/styles/main.pcss';
import './popup.pcss';

try {
    ReactDOM.render(
        <ErrorBoundary>
            <Provider>
                <App />
            </Provider>
        </ErrorBoundary>,
        document.getElementById('root')
    );
} catch (error) {
    log.error(error);
}
