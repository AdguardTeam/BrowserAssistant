import React from 'react';
import './AppClosed.pcss';

const STATES = {
    isNotRunning: {
        title: 'AdGuard is not running',
        buttonText: 'run adguard',
    },
    isNotInstalled: {
        title: 'AdGuard is not installed',
        buttonText: 'download',
    },
    isPaused: {
        title: 'AdGuard protection is paused',
        buttonText: 'enable',
    },
};

const AppClosed = ({ status }) => (
    <div className="app-closed__wrapper">
        <header className="app-closed__status">{STATES[status].title}</header>
        <button className="app-closed__button" type="button">{STATES[status].buttonText}</button>
    </div>
);

export default AppClosed;
