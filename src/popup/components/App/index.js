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
import getMessageHandler from '../../messageHandler';

Modal.setAppElement('#root');

const App = observer(() => {
    const root = useContext(rootStore);

    const {
        settingsStore: {
            updateCurrentTabInfo,
            refreshUpdateStatusInfo,
        },
        uiStore: {
            requestStatus,
            normalizePopupScale,
        },
        translationStore: {
            locale,
        },
    } = root;

    const messageHandler = getMessageHandler(root);

    useEffect(() => {
        (async () => {
            await refreshUpdateStatusInfo();
            normalizePopupScale();
            await updateCurrentTabInfo();
        })();

        browser.runtime.onMessage.addListener(messageHandler);
        return () => browser.runtime.onMessage.removeListener(messageHandler);
    }, []);

    if (!locale) {
        return (<Loading />);
    }

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
