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

            this.rootStore.settingsStore.setCurrentFilteringState(res.parameters);
        } catch (error) {
            log.error(error);
        }
    };

    getCurrentAppState = async () => {
        try {
            const res = await innerMessaging.getCurrentAppState();
            this.rootStore.settingsStore.setCurrentAppState(res.appState);
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
            await innerMessaging.setFilteringStatus({
                url,
                isEnabled,
                isHttpsEnabled,
            });
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
            await innerMessaging.openOriginalCert({
                domain: currentTabHostname,
                port: currentPort,
            });
        } catch (error) {
            log.error(error);
        }
    };

    removeCustomRules = async () => {
        const { currentURL: url } = this.rootStore.settingsStore;

        await innerMessaging.reload();
        try {
            await innerMessaging.removeCustomRules({ url });
            this.rootStore.uiStore.setPageFilteredByUserFilter(false);
        } catch (error) {
            log.error(error);
        }
    };

    reportSite = async () => {
        const { currentURL: url, referrer } = this.rootStore.settingsStore;
        try {
            await innerMessaging.reportSite({
                url,
                referrer,
            });

            window.close();
        } catch (error) {
            log.error(error);
        }
    };

    openFilteringLog = async () => {
        try {
            await innerMessaging.openFilteringLog();
            window.close();
        } catch (error) {
            log.error(error);
        }
    };

    removeRule = async () => {
        const { currentTabHostname: ruleText } = this.rootStore.settingsStore;
        try {
            await innerMessaging.removeRule({ ruleText });
        } catch (error) {
            log.error(error);
        }
    };

    addRule = async () => {
        const { currentTabHostname: ruleText } = this.rootStore.settingsStore;
        try {
            await innerMessaging.addRule({ ruleText });
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
            this.rootStore.uiStore.setExtensionLoading(false);

            await this.rootStore.settingsStore.setCurrentAppState(res.appState);
            await this.rootStore.settingsStore.setProtection(res.appState.isProtectionEnabled);

            this.rootStore.uiStore.setProtectionTogglePending(false);
        } catch (error) {
            log.error(error);
        }
    };

    startApp = async () => {
        try {
            this.rootStore.uiStore.setExtensionLoading(true);
            await this.getCurrentFilteringState(true);
            this.rootStore.uiStore.setExtensionLoading(false);
        } catch (error) {
            log.error(error);
        }
    };

    updateApp = async () => {
        try {
            await innerMessaging.updateApp();
        } catch (error) {
            log.error(error);
        }
    };

    openSettings = async () => {
        try {
            await innerMessaging.openSettings();
            window.close();
        } catch (error) {
            log.error(error);
        }
    };

    startBlockingAd = async () => {
        try {
            await innerMessaging.initAssistant();
        } catch (error) {
            log.error(error);
        }
        window.close();
    };
}

export default RequestsStore;
