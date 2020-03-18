import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'mobx-react';
import App from './components/App';
import './styles/main.pcss';
import log from '../lib/logger';

try {
    ReactDOM.render(
        <Provider>
            <App />
        </Provider>,
        document.getElementById('root')
    );
} catch (error) {
    log.error(error);
}
