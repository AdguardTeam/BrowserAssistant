import React from 'react';
import './Loading.pcss';

const Loading = ({ title }) => (
    <div className="loading--wrapper">
        {title && <header className="loading--header">{title}</header>}
        <div className="loading" />
    </div>
);

export default Loading;
