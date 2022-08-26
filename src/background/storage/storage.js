export class Storage {
    constructor(storage) {
        this.storage = storage;
    }

    async set(key, value) {
        await this.storage.set({ [key]: value });
    }

    async get(key) {
        const storedValue = await this.storage.get(key);
        return storedValue[key];
    }
}
