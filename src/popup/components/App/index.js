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
import { SETUP_STATES } from '../../../lib/types';
import Loading from '../ui/Loading';
import responseHandler from '../../responseHandler';

Modal.setAppElement('#root');

const App = observer(() => {
    const {
        settingsStore: {
            getCurrentTabUrlProperties,
            setIsAppUpToDate,
            setIsExtensionUpdated,
            setIsSetupCorrect,
        },
        uiStore: {
            requestStatus,
            normalizePopupScale,
        },
    } = useContext(rootStore);


    useEffect(() => {
        (async () => {
            await getCurrentTabUrlProperties();

            const {
                isAppUpToDate,
                isExtensionUpdated,
                isSetupCorrect,
            } = await browser.storage.local.get(Object.keys(SETUP_STATES));

            setIsAppUpToDate(isAppUpToDate);
            setIsExtensionUpdated(isExtensionUpdated);
            setIsSetupCorrect(isSetupCorrect);
        })();

        browser.runtime.onMessage.addListener(responseHandler);
        return () => browser.runtime.onMessage.removeListener(responseHandler);
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
