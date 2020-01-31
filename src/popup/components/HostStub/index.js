import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import rootStore from '../../stores';
import './host-stub.pcss';
import { ORIGINAL_CERT_STATUS } from '../../stores/consts';
import Switcher from '../Settings/Switcher';

const HostStub = observer(() => {
    const {
        settingsStore: {
            isHttps,
            isPageSecured,
            isHttpsFilteringEnabled,
            isFilteringEnabled,
            isInstalled,
            isRunning,
            isProtectionEnabled,
            originalCertStatus,
            isAppUpToDate,
            isExtensionUpdated,
            isSetupCorrectly,

            setIsHttps,
            setSecure,
            setHttpsFiltering,
            setFiltering,
            setOriginalCertStatus,
            setInstalled,
            setRunning,
            setProtection,
            setSetupCorrectly,
            setIsAppUpToDate,
            setIsExtensionUpdated,
        },
        uiStore: {
            isPageFilteredByUserFilter,
            isLoading,
            isProtectionTogglePending,
            isExtensionPending,

            setExtensionReloading,
            setExtensionPending,
            setPageFilteredByUserFilter,
            setProtectionTogglePending,
        },
    } = useContext(rootStore);

    const settingsObservers = {
        isHttps,
        isPageSecured,
        isHttpsFilteringEnabled,
        isFilteringEnabled,
        isInstalled,
        isRunning,
        isProtectionEnabled,
        originalCertStatus,
        isAppUpToDate,
        isExtensionUpdated,
        isSetupCorrectly,
    };

    const uiObservers = {
        isPageFilteredByUserFilter,
        isLoading,
        isProtectionTogglePending,
        isExtensionPending,
    };

    const settingsObserverToSetterMap = {
        isHttps: setIsHttps,
        isPageSecured: setSecure,
        isHttpsFilteringEnabled: setHttpsFiltering,
        isFilteringEnabled: setFiltering,
        isInstalled: setInstalled,
        isRunning: setRunning,
        isProtectionEnabled: setProtection,
        originalCertStatus: setOriginalCertStatus,
        isAppUpToDate: setIsAppUpToDate,
        isExtensionUpdated: setIsExtensionUpdated,
        isSetupCorrectly: setSetupCorrectly,
    };

    const uiObserverToSetterMap = {
        isPageFilteredByUserFilter: setPageFilteredByUserFilter,
        isLoading: setExtensionReloading,
        isProtectionTogglePending: setProtectionTogglePending,
        isExtensionPending: setExtensionPending,
    };

    const renderCertSelect = () => (
        <select onChange={(e) => {
            setOriginalCertStatus(e.target.value);
        }}
        >
            {Object.values(ORIGINAL_CERT_STATUS)
                .map((value) => (
                    <option
                        key={value}
                        value={value}
                    >
                        {value}
                    </option>
                ))}
        </select>
    );

    const getOutput = (observers, mapObserverToSetter) => Object.entries(observers)
        .map(([key, value]) => {
            return (
                <div
                    key={key}
                    title={typeof value}
                    className="no-text"
                >
                    <span>{key}</span>
                    <span>{': '}</span>
                    {key === 'originalCertStatus' ? renderCertSelect()
                        : (
                            <Switcher
                                checked={value}
                                onClick={() => mapObserverToSetter[key](!value)}
                            />
                        )}
                </div>
            );
        });

    const settingsOutput = getOutput(settingsObservers, settingsObserverToSetterMap);

    const uiOutput = getOutput(uiObservers, uiObserverToSetterMap);

    return (
        <div className="host-stub">
            <h4>Settings</h4>
            {settingsOutput}
            <br />
            <h4>UI</h4>
            {uiOutput}
        </div>
    );
});

export default HostStub;
