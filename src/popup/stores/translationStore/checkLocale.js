const checkPartialKeyMatch = (keysToCheck, key) => {
    return keysToCheck.find((keyToCheck) => {
        return keyToCheck.includes(key);
    });
};

const checkLocale = (messagesMap, locale) => {
    const result = {
        suitable: false,
        matchedKey: locale,
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
        return result;
    }

    if (locale.length > 2) {
        // try to look up key with replaced hyphens to underscores
        const underscored = locale.replace(/-/g, '_');
        if (messagesMap[underscored]) {
            result.suitable = true;
            result.locale = underscored;
            result.matchedKey = underscored;
            return result;
        }

        // try to look up key with replaced underscores to hyphens
        const hyphened = locale.replace(/_/g, '-');
        if (messagesMap[hyphened]) {
            result.suitable = true;
            result.locale = hyphened;
            result.matchedKey = hyphened;
            return result;
        }

        // try to look up shortened long locales
        const shortened = locale.slice(0, 2);
        return checkLocale(messagesMap, shortened);
    }

    // check partial key match, e.g "zh" when in messagesMap we have "zh_cn" and "zh_tw"
    const matchedKey = checkPartialKeyMatch(Object.keys(messagesMap), locale);
    if (matchedKey) {
        result.suitable = true;
        result.matchedKey = matchedKey;
        return result;
    }

    return result;
};

export default checkLocale;
