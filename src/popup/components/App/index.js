import React, { useEffect, useContext } from 'react';
import Modal from 'react-modal';
import { observer } from 'mobx-react';

import Settings from '../Settings';
import Options from '../Options';
import CurrentSite from '../CurrentSite';
import AppClosed from './AppClosed';
import AppWrapper from './AppWrapper';
import TrialExpired from './TrialExpired';
import rootStore from '../../stores';
import Loading from '../ui/Loading';
import { createLongLivedConnection } from '../../messageService';
import { TermsAgreement, ORIGIN } from '../../../shared/components/TermsAgreement';

Modal.setAppElement('#root');

const App = observer(() => {
    const rootContext = useContext(rootStore);

    const { settingsStore, uiStore, translationStore } = rootContext;

    useEffect(() => {
        const onUnload = createLongLivedConnection(rootContext);

        return () => {
            onUnload();
        };
    }, []);

    useEffect(() => {
        (async () => {
            await settingsStore.getPopupData();
        })();
    }, []);

    const { isAppWorking, isLicenseExpired } = settingsStore;

    const onAgreement = async () => {
        await settingsStore.getPopupData();
    };

    if (settingsStore.loadingConsent) {
        return <Loading />;
    }

    if (settingsStore.consentRequired) {
        return (
            <AppWrapper>
                <TermsAgreement
                    origin={ORIGIN.POPUP}
                    onAgreement={onAgreement}
                />
            </AppWrapper>
        );
    }

    if (!translationStore.isReadyToDisplayMessages) {
        return (
            <AppWrapper />
        );
    }

    if (isLicenseExpired) {
        return (
            <TrialExpired />
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
