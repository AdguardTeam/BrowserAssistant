import React from 'react';
import log from '../../../lib/logger';
import ClosedApp from '../App/AppClosed/ClosedApp';
import Header from '../Header';
import { StoreConsumer } from '../../stores';

class ErrorBoundary extends React.Component {
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
            <StoreConsumer>
                {(props) => (
                    <>
                        <Header />
                        <ClosedApp
                            content="something_went_wrong"
                            buttonText="contact_support"
                            onClick={props.settingsStore.contactSupport}
                        />
                    </>
                )}
            </StoreConsumer>
        ) : children;
    }
}

export default ErrorBoundary;
