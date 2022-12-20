const checkPartialKeyMatch = (keysToCheck, key) => {
    return keysToCheck.find((keyToCheck) => {
        return keyToCheck.includes(key);
    });
};

/**
 * Finds suitable locale key in messagesMap and returns it
 * @param {object} messagesMap
 * @param {string} locale
 * @returns {{suitable: boolean, locale: string}}
 */
const checkLocale = (messagesMap, locale) => {
    const result = {
        suitable: false,
        locale,
    };

    if (!locale) {
        result.suitable = false;
        return result;
    }

    // eslint-disable-next-line no-param-reassign
    locale = locale.toLowerCase();

    // strict match
    if (messagesMap[locale]) {
        result.suitable = true;
        result.locale = locale;
        return result;
    }

    if (locale.length > 2) {
        // try to look up key with replaced hyphens to underscores
        const underscored = locale.replace(/-/g, '_');
        if (messagesMap[underscored]) {
            result.suitable = true;
            result.locale = underscored;
            return result;
        }

        // try to look up key with replaced underscores to hyphens
        const hyphened = locale.replace(/_/g, '-');
        if (messagesMap[hyphened]) {
            result.suitable = true;
            result.locale = hyphened;
            return result;
        }

        // try to look up shortened long locales
        const shortened = locale.slice(0, 2);
        return checkLocale(messagesMap, shortened);
    }

    // check partial key match, e.g "zh" when in messagesMap we have "zh_cn" and "zh_tw"
    const matchedLocale = checkPartialKeyMatch(Object.keys(messagesMap), locale);
    if (matchedLocale) {
        result.suitable = true;
        result.locale = matchedLocale;
        return result;
    }

    return result;
};

export default checkLocale;
