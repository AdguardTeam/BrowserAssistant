import React, { Fragment } from 'react';

import './Loading.pcss';

const Loading = () => {
    return (
        <Fragment>
            <div className="loading--wrapper">
                <header className="loading--header">Preparing...</header>
                <div className="loading" />
            </div>
        </Fragment>

    );
};

export default Loading;
