/// <reference lib="dom"/>
export class LocalStorage {
    constructor() {
        this.prefix = "linejs:";
    }
    async set(key, value) {
        localStorage.setItem(this.prefix + key, JSON.stringify(value));
    }
    async get(key) {
        try {
            return JSON.parse(localStorage.getItem(this.prefix + key) || "null");
        }
        catch (_) {
        }
    }
    async delete(key) {
        localStorage.removeItem(this.prefix + key);
    }
    async clear() {
        localStorage.clear();
    }
    async migrate(storage) {
        for (let index = 0; index < localStorage.length; index++) {
            const k = localStorage.key(index);
            if (k) {
                await storage.set(k.replace(this.prefix, ""), localStorage.getItem(k));
            }
            else {
                continue;
            }
        }
    }
}
//# sourceMappingURL=local.js.map