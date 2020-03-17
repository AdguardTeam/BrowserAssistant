const { BASE_LOCALE } = require('../../tasks/consts');

class State {
    isFilteringEnabled = true;

    isInstalled = true;

    isRunning = true;

    isProtectionEnabled = true;

    isAppUpToDate = true;

    isExtensionUpdated = true;

    isSetupCorrect = true;

    locale = BASE_LOCALE;

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

    get isAppWorking() {
        return [this.isInstalled, this.isRunning, this.isProtectionEnabled, this.isAppUpToDate,
            this.isExtensionUpdated, this.isSetupCorrect, this.isFilteringEnabled]
            .every((state) => state === true);
    }
}

export default new State();
