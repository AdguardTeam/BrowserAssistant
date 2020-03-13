import log from '../../../lib/logger';
import innerMessaging from '../../../lib/innerMessaging';

class RequestsStore {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    getCurrentFilteringState = async (forceStartApp = false) => {
        const { currentURL: url, currentPort: port } = this.rootStore.settingsStore;

        try {
            const res = await innerMessaging.getCurrentFilteringState({
                url,
                port,
                forceStartApp,
            });

            this.rootStore.settingsStore.setCurrentFilteringState(res.params.parameters);
            this.rootStore.settingsStore.setCurrentAppState(res.params.appState);
        } catch (error) {
            log.error(error);
        }
    };

    getCurrentAppState = async () => {
        try {
            const res = await innerMessaging.getCurrentAppState();
            this.rootStore.settingsStore.setCurrentAppState(res.params.appState);
        } catch (error) {
            log.error(error);
        }
    };

    setFilteringStatus = async () => {
        const {
            currentURL: url,
            isFilteringEnabled: isEnabled,
            isHttpsFilteringEnabled: isHttpsEnabled,
        } = this.rootStore.settingsStore;

        try {
            const res = await innerMessaging.setFilteringStatus({
                url,
                isEnabled,
                isHttpsEnabled,
            });

            this.rootStore.settingsStore.setCurrentAppState(res.params.appState);
        } catch (error) {
            log.error(error);
        }
    };

    openOriginalCert = async () => {
        const {
            currentTabHostname,
            currentPort,
        } = this.rootStore.settingsStore;

        try {
            const res = await innerMessaging.openOriginalCert({
                domain: currentTabHostname,
                port: currentPort,
            });

            this.rootStore.settingsStore.setCurrentAppState(res.params.appState);
        } catch (error) {
            log.error(error);
        }
    };

    removeCustomRules = async () => {
        const { currentURL: url } = this.rootStore.settingsStore;

        innerMessaging.reload();
        try {
            const res = await innerMessaging.removeCustomRules({ url });
            this.rootStore.uiStore.setPageFilteredByUserFilter(false);

            this.rootStore.settingsStore.setCurrentAppState(res.params.appState);
        } catch (error) {
            log.error(error);
        }
    };

    reportSite = async () => {
        const { currentURL: url, referrer } = this.rootStore.settingsStore;
        try {
            const res = await innerMessaging.reportSite({
                url,
                referrer,
            });
            this.rootStore.settingsStore.setCurrentAppState(res.params.appState);
            await innerMessaging.openPage(res.params.parameters.reportUrl);

            /** The popup in Firefox is not closed after opening new tabs by Tabs API.
             *  Reload re-renders popup. */
            window.location.reload();
        } catch (error) {
            log.error(error);
        }
    };

    openFilteringLog = async () => {
        try {
            const res = await innerMessaging.openFilteringLog();
            this.rootStore.settingsStore.setCurrentAppState(res.params.appState);
            window.close();
        } catch (error) {
            log.error(error);
        }
    };

    removeRule = async () => {
        const { currentTabHostname: ruleText } = this.rootStore.settingsStore;
        try {
            const res = await innerMessaging.removeRule({ ruleText });
            this.rootStore.settingsStore.setCurrentAppState(res.params.appState);
        } catch (error) {
            log.error(error);
        }
    };

    addRule = async () => {
        const { currentTabHostname: ruleText } = this.rootStore.settingsStore;
        try {
            const res = await innerMessaging.addRule({ ruleText });
            this.rootStore.settingsStore.setCurrentAppState(res.params.appState);
        } catch (error) {
            log.error(error);
        }
    };

    setProtectionStatus = async (shouldEnableProtection) => {
        try {
            this.rootStore.uiStore.setExtensionLoading(true);
            const res = await innerMessaging.setProtectionStatus(
                { isEnabled: shouldEnableProtection }
            );

            this.rootStore.settingsStore.setCurrentAppState(res.params.appState);

            await this.rootStore.settingsStore.setProtection(
                res.params.appState.isProtectionEnabled
            );

            await innerMessaging.updateIconColor(res.params.appState.isProtectionEnabled);

            this.rootStore.uiStore.setProtectionTogglePending(false);
        } catch (error) {
            log.error(error);
        }
    };

    startApp = async () => {
        this.rootStore.uiStore.setExtensionLoading(true);
        try {
            const res = await this.getCurrentFilteringState(true);
            this.rootStore.settingsStore.setCurrentAppState(res.params.appState);
        } catch (error) {
            log.error(error);
        }
    };

    updateApp = async () => {
        try {
            const res = await innerMessaging.updateApp();
            this.rootStore.settingsStore.setCurrentAppState(res.params.appState);
        } catch (error) {
            log.error(error);
        }
    };

    openSettings = async () => {
        try {
            const res = await innerMessaging.openSettings();
            this.rootStore.settingsStore.setCurrentAppState(res.params.appState);
            window.close();
        } catch (error) {
            log.error(error);
        }
    };

    startBlockingAd = async () => {
        try {
            const res = await innerMessaging.initAssistant();
            this.rootStore.settingsStore.setCurrentAppState(res.params.appState);
        } catch (error) {
            log.error(error);
        }
        window.close();
    };
}

export default RequestsStore;
