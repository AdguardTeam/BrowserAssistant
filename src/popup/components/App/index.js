import React, { Fragment } from 'react';
import Settings from '../Settings';
import Header from '../Header';
import Options from '../Options';
import CurrentSite from '../CurrentSite';
import './app.pcss';

function App() {
    return (
        <Fragment>
            <Header />
            <CurrentSite />
            <Settings />
            <Options />
        </Fragment>
    );
}

export default App;
