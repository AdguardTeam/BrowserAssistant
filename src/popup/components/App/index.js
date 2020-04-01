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
import getMessageHandler from '../../messaging';

Modal.setAppElement('#root');

const App = observer(() => {
    const rootContext = useContext(rootStore);

    const { settingsStore, uiStore, translationStore } = rootContext;

    const messageHandler = getMessageHandler(rootContext);

    useEffect(() => {
        (async () => {
            await settingsStore.getPopupData();
        })();

        browser.runtime.onMessage.addListener(messageHandler);
        return () => browser.runtime.onMessage.removeListener(messageHandler);
    }, []);

    if (!translationStore.getLocale()) {
        return (<Loading />);
    }

    const { requestStatus } = uiStore;

    if (requestStatus.isError || requestStatus.isPending) {
        return (
            <AppWrapper>
                <AppClosed />
            </AppWrapper>
        );
    }

    if (requestStatus.isSuccess) {
        return (
            <AppWrapper>
                <CurrentSite />
                <Settings />
                <Options />
            </AppWrapper>
        );
    }

    return (<Loading />);
});

export default App;
