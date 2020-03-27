const checkLocale = (messagesMap, locale) => {
    const result = {
        suitable: false,
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
    }

    return result;
};

export default checkLocale;
