/**
 * Wrapper around localStorage api
 * Used to set and get data from the storage
 */
class LocalStorage {
    constructor() {
        this.storage = window.localStorage;
    }

    /**
     * Saves data in the storage by key
     * @param key
     * @param data
     */
    set(key, data) {
        return this.storage.setItem(key, data);
    }

    /**
     * Returns data from the storage by key
     * @param key
     * @returns {string}
     */
    get(key) {
        return this.storage.getItem(key);
    }
}

export const localStorage = new LocalStorage();
