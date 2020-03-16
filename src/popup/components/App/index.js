import React, { useEffect, useLayoutEffect, useContext } from 'react';
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
    } = root;

    const messageHandler = getMessageHandler(root);

    useEffect(() => {
        (async () => {
            await updateCurrentTabInfo();
            await refreshUpdateStatusInfo();
        })();

        browser.runtime.onMessage.addListener(messageHandler);
        return () => browser.runtime.onMessage.removeListener(messageHandler);
    }, []);

    useLayoutEffect(() => {
        normalizePopupScale();
    });
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
