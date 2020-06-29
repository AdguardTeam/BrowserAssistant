import React from 'react';
import log from '../../../lib/logger';
import ClosedApp from '../App/AppClosed/ClosedApp';
import Header from '../Header';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error) {
        log.error(error);
    }

    render() {
        const { error } = this.state;
        const { children } = this.props;

        return error ? (
            <>
                <Header />
                <ClosedApp content={error.message} buttonText="contact_support" onClick={log.info} />
            </>
        ) : children;
    }
}

export default Index;
