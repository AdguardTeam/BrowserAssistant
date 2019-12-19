import React, { Fragment } from 'react';

import './Loading.pcss';

const Loading = ({ title }) => (
    <Fragment>
        <div className="loading--wrapper">
            {title && <header className="loading--header">{title}</header>}
            <div className="loading" />
        </div>
    </Fragment>

);

export default Loading;
