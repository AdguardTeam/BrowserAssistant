class State {
    isFilteringEnabled = true;

    isInstalled = true;

    isRunning = true;

    isProtectionEnabled = true;

    isAppUpToDate = true;

    isExtensionUpdated = true;

    isSetupCorrect = true;

    setIsFilteringEnabled = (isFilteringEnabled) => {
        this.isFilteringEnabled = isFilteringEnabled;
    };

    setIsInstalled = (isInstalled) => {
        this.isInstalled = isInstalled;
    };

    setIsRunning = (isRunning) => {
        this.isRunning = isRunning;
    };

    setIsProtectionEnabled = (isProtectionEnabled) => {
        this.isProtectionEnabled = isProtectionEnabled;
    };

    setIsAppUpToDate = (isAppUpToDate) => {
        this.isAppUpToDate = isAppUpToDate;
    };

    setIsExtensionUpdated = (isExtensionUpdated) => {
        this.isExtensionUpdated = isExtensionUpdated;
    };

    setIsSetupCorrect = (isSetupCorrect) => {
        this.isSetupCorrect = isSetupCorrect;
    };

    setLocale = (locale) => {
        this.locale = locale;
    };

    setIsAuthorized = (isAuthorized) => {
        this.isAuthorized = isAuthorized;
    };

    updateAppState = async (appState) => {
        const {
            isInstalled,
            isRunning,
            locale,
            isProtectionEnabled,
            isAuthorized,
        } = appState;

        this.setIsInstalled(isInstalled);
        this.setIsRunning(isRunning);
        this.setLocale(locale);
        this.setIsProtectionEnabled(isProtectionEnabled);
        this.setIsAuthorized(isAuthorized);
    };

    updateAppSetup = (isAppUpToDate, isExtensionUpdated, locale) => {
        this.setIsAppUpToDate(isAppUpToDate);
        this.setIsExtensionUpdated(isExtensionUpdated);
        this.setLocale(locale);
    };

    get isAppWorking() {
        return [this.isInstalled, this.isRunning, this.isProtectionEnabled, this.isAppUpToDate,
            this.isExtensionUpdated, this.isSetupCorrect, this.isFilteringEnabled]
            .every((state) => state === true);
    }

    getIsAuthorized() {
        return !!this.isAuthorized;
    }
}

export default new State();
