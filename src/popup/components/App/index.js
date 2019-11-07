import React, {
    Fragment, useState, useEffect, useContext,
} from 'react';
import Modal from 'react-modal';
import browser from 'webextension-polyfill';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import Settings from '../Settings';
import Header from '../Header';
import Options from '../Options';
import CurrentSite from '../CurrentSite';
import AppClosed from './AppClosed';
import rootStore from '../../stores';
import { REQUEST_STATUSES } from '../../stores/consts';

Modal.setAppElement('#root');

const App = observer(() => {
    const { settingsStore, uiStore, requestsStore } = useContext(rootStore);
    const [status, setRequestStatus] = useState(REQUEST_STATUSES.PENDING);
    const {
        setCurrentFilteringState,
        setCurrentAppState,
        getCurrentTabHostname, getReferrer,
    } = settingsStore;

    const appClass = classNames({
        'loading--pending': status === REQUEST_STATUSES.PENDING,
        'loading--success': status === REQUEST_STATUSES.SUCCESS,
    });

    useEffect(() => {
        (async () => {
            await getCurrentTabHostname();
            await getReferrer();
            requestsStore.getCurrentFilteringState();
        })();

        browser.runtime.onMessage.addListener(
            (response) => {
                const { parameters, appState, requestId } = response;

                if (!requestId) {
                    return;
                }

                const { isInstalled, isRunning, isProtectionEnabled } = appState;
                const workingState = { isInstalled, isRunning, isProtectionEnabled };

                uiStore.setAppWorkingStatus(Object.values(workingState)
                    .every(state => state === true));

                if (parameters && parameters.originCertStatus) {
                    setCurrentFilteringState(parameters);
                }

                setCurrentAppState(workingState);

                setRequestStatus(uiStore.isAppWorking
                    ? REQUEST_STATUSES.SUCCESS : REQUEST_STATUSES.ERROR);
            }
        );

        return () => {
            browser.runtime.onMessage.removeListener();
        };
    }, []);
    return (
        <Fragment>
            {status !== REQUEST_STATUSES.ERROR
            && (
                <div className={appClass}>
                    <Header />
                    <CurrentSite />
                    <Settings />
                    <Options />
                </div>
            )}
            {status === REQUEST_STATUSES.ERROR && (
                <Fragment>
                    <Header />
                    <AppClosed />
                </Fragment>
            )}
        </Fragment>

    );
});

export default App;
