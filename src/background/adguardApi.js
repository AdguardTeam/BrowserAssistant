/**
 * This file is part of Adguard Browser Extension (https://github.com/AdguardTeam/AdguardBrowserExtension).
 *
 * Adguard Browser Extension is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Adguard Browser Extension is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Adguard Browser Extension.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Adguard simple api
 * @type {{start, stop, configure}}
 */
export default function (adguard, global) {
    function noOpFunc() {
    }

    /**
     * Validates configuration
     * @param configuration Configuration object
     */
    function validateConfiguration(configuration) {
        if (!configuration) {
            throw new Error('"configuration" parameter is required');
        }
        validateFiltersConfiguration(configuration.filters);
        validateDomains(configuration.whitelist, 'whitelist');
        validateDomains(configuration.blacklist, 'blacklist');
    }

    /**
     * Validates filters identifiers
     * @param filters Array
     */
    function validateFiltersConfiguration(filters) {
        if (!filters || filters.length === 0) {
            return;
        }
        for (let i = 0; i < filters.length; i++) {
            const filterId = filters[i];
            if (typeof filterId !== 'number') {
                throw new Error(`${filterId} is not a number`);
            }
        }
    }

    /**
     * Validate domains
     * @param domains Array
     * @param prop Property name (whitelist or blacklist)
     */
    function validateDomains(domains, prop) {
        if (!domains || domains.length === 0) {
            return;
        }
        for (let i = 0; i < domains.length; i++) {
            const domain = domains[i];
            if (typeof domain !== 'string') {
                throw new Error(`Domain ${domain} at position ${i} in ${prop} is not a string`);
            }
        }
    }

    /**
     * Configures white and black lists.
     * If blacklist is not null filtration will be in inverted mode, otherwise in default mode.
     * @param configuration Configuration object: {whitelist: [], blacklist: []}
     */
    function configureWhiteBlackLists(configuration) {
        if (!configuration.force && !configuration.blacklist && !configuration.whitelist) {
            return;
        }

        let domains;
        if (configuration.blacklist) {
            adguard.whitelist.changeDefaultWhiteListMode(false);
            domains = configuration.blacklist;
        } else {
            adguard.whitelist.changeDefaultWhiteListMode(true);
            domains = configuration.whitelist;
        }
        adguard.whitelist.updateWhiteListDomains(domains || []);
    }

    /**
     * Configures enabled filters
     * @param configuration Configuration object: {filters: [...]}
     * @param callback
     */
    function configureFilters(configuration, callback) {
        if (!configuration.force && !configuration.filters) {
            callback();
            return;
        }

        const filterIds = (configuration.filters || []).slice(0);
        for (let i = filterIds.length - 1; i >= 0; i--) {
            const filterId = filterIds[i];
            const filter = adguard.subscriptions.getFilter(filterId);
            if (!filter) {
                adguard.console.error('Filter with id {0} not found. Skip it...', filterId);
                filterIds.splice(i, 1);
            }
        }

        adguard.filters.addAndEnableFilters(filterIds, () => {
            const enabledFilters = adguard.filters.getEnabledFilters();
            for (let i = 0; i < enabledFilters.length; i++) {
                const filter = enabledFilters[i];
                if (filterIds.indexOf(filter.filterId) < 0) {
                    adguard.filters.disableFilters([filter.filterId]);
                }
            }
            callback();
        });
    }

    /**
     * Configures custom (user) rules
     * @param configuration Configuration object: {rules: [...]}
     */
    function configureCustomRules(configuration) {
        if (!configuration.force && !configuration.rules) {
            return;
        }

        const content = (configuration.rules || []).join('\r\n');
        adguard.userrules.updateUserRulesText(content);
    }

    /**
     * Configures backend's URLs
     * @param configuration Configuration object: {filtersMetadataUrl: '...', filterRulesUrl: '...'}
     */
    function configureFiltersUrl(configuration) {
        if (!configuration.force && !configuration.filtersMetadataUrl && !configuration.filterRulesUrl) {
            return;
        }
        adguard.backend.configure({
            filtersMetadataUrl: configuration.filtersMetadataUrl,
            filterRulesUrl: configuration.filterRulesUrl,
        });
    }

    /**
     * Start filtration.
     * Also perform installation on first run.
     * @param configuration Configuration object
     * @param callback Callback function
     */
    const start = function (configuration, callback) {
        validateConfiguration(configuration);

        callback = callback || noOpFunc;

        // Force apply all configuration fields
        configuration.force = true;

        adguard.rulesStorage.init(() => {
            adguard.localStorage.init(() => {
                adguard.filters.start({}, () => {
                    configure(configuration, callback);
                });
            });
        });
    };

    /**
     * Stop filtration
     * @param callback Callback function
     */
    const stop = function (callback) {
        adguard.filters.stop(callback || noOpFunc);
    };

    /**
     * Configure current filtration settings
     * @param configuration Filtration configuration: {filters: [], whitelist: [], blacklist: []}
     * @param callback
     */
    var configure = function (configuration, callback) {
        if (!adguard.filters.isInitialized()) {
            throw new Error('Applications is not initialized. Use \'start\' method.');
        }
        validateConfiguration(configuration);

        callback = callback || noOpFunc;

        configureFiltersUrl(configuration);
        configureWhiteBlackLists(configuration);
        configureCustomRules(configuration);
        configureFilters(configuration, callback);
    };

    const initAssistant = function (tabId) {
        const assistantOptions = {
            addRuleCallbackName: 'assistant-create-rule',
        };
        adguard.tabs.sendMessage(tabId, {
            type: 'initAssistant',
            options: assistantOptions,
        });
    };

    /**
     * Opens assistant dialog in the specified tab
     * @param tabId Tab identifier
     */
    const openAssistant = (tabId) => {
        if (adguard.tabs.executeScriptFile) {
            // Load Assistant code to the activate tab immediately
            adguard.tabs.executeScriptFile(null, { file: '/adguard/assistant/assistant.js' }, () => {
                initAssistant(tabId);
            });
        } else {
            // Manually start assistant
            initAssistant(tabId);
        }
    };

    /**
     * Closes assistant dialog in the specified tab
     * @param tabId Tab identifier
     */
    const closeAssistant = function (tabId) {
        adguard.tabs.sendMessage(tabId, {
            type: 'destroyAssistant',
        });
    };

    adguard.backend.configure({
        localFiltersFolder: 'adguard',
        redirectSourcesFolder: 'adguard',
        localFilterIds: [],
    });

    global.adguardApi = {
        start,
        stop,
        configure,
        /**
         *  Fired when a request is blocked
         *  var onBlocked = function (details) {console.log(details);};
         *  adguardApi.onRequestBlocked.addListener(onBlocked);
         *  adguardApi.onRequestBlocked.removeListener(onBlocked);
         *  details = {
         *      tabId: ...,
         *      requestUrl: "...",
         *      referrerUrl: "...",
         *      requestType: "...", see adguard.RequestTypes
         *      rule: "..." // Rule text
         *      filterId: ... // Filter identifier
         *   };
         */
        onRequestBlocked: adguard.webRequestService.onRequestBlocked,
        openAssistant,
        closeAssistant,
    };
}
