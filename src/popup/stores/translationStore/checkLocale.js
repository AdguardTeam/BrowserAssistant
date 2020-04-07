const checkPartialKeyMatch = (keysToCheck, key) => {
    return keysToCheck.find((keyToCheck) => {
        return keyToCheck.includes(key);
    });
};

const checkLocale = (messagesMap, locale) => {
    const result = {
        suitable: false,
        originalKey: locale,
        locale,
    };

    if (!locale) {
        result.suitable = false;
        return result;
    }

    // strict match
    if (messagesMap[locale]) {
        result.suitable = true;
        return result;
    }

    // check partial key match
    const originalKey = checkPartialKeyMatch(Object.keys(messagesMap), locale);
    if (originalKey) {
        result.suitable = true;
        result.originalKey = originalKey;
        return result;
    }

    if (locale.length > 2) {
        // try to replace hyphens to underscores
        const underscored = locale.replace(/-/g, '_');
        if (messagesMap[underscored]) {
            result.suitable = true;
            result.locale = underscored;
            return result;
        }

        // try to replace underscores to hyphens
        const hyphened = locale.replace(/_/g, '-');
        if (messagesMap[hyphened]) {
            result.suitable = true;
            result.locale = hyphened;
            return result;
        }

        // try to shorten long locales
        const shortened = locale.slice(0, 2);
        if (messagesMap[shortened]) {
            result.suitable = true;
            result.locale = shortened;
            return result;
        }

        // check partial key match for shortened locale
        const originalKey = checkPartialKeyMatch(Object.keys(messagesMap), shortened);
        if (originalKey) {
            result.suitable = true;
            result.originalKey = originalKey;
            return result;
        }
    }

    return result;
};

export default checkLocale;
