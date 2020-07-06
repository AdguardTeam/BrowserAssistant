import React, { useEffect, useContext } from 'react';
import Modal from 'react-modal';
import browser from 'webextension-polyfill';
import { observer } from 'mobx-react';
import Settings from '../Settings';
import Options from '../Options';
import CurrentSite from '../CurrentSite';
import AppClosed from './AppClosed';
import AppWrapper from './AppWrapper';
import rootStore from '../../stores';
import Loading from '../ui/Loading';
import getMessageReceiver from '../../messaging/receiver';

Modal.setAppElement('#root');

const App = observer(() => {
    const rootContext = useContext(rootStore);

    const { settingsStore, uiStore, translationStore } = rootContext;

    const messageHandler = getMessageReceiver(rootContext);

    useEffect(() => {
        (async () => {
            await settingsStore.getPopupData();
        })();

        browser.runtime.onMessage.addListener(messageHandler);
        return () => browser.runtime.onMessage.removeListener(messageHandler);
    }, []);

    const { isAppWorking } = settingsStore;

    if (!translationStore.isReadyToDisplayMessages) {
        return (
            <AppWrapper />
        );
    }

    if (!isAppWorking || uiStore.isLoading) {
        return (
            <AppWrapper>
                <AppClosed />
            </AppWrapper>
        );
    }

    if (isAppWorking) {
        return (
            <AppWrapper>
                <CurrentSite />
                <Settings />
                <Options />
            </AppWrapper>
        );
    }

    return <Loading />;
});

export default App;
