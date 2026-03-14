/// <reference lib="dom"/>
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _IndexedDBStorage_db;
function successToPromise(request) {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onerror = (event) => {
            reject(event);
        };
    });
}
function completeToPromise(transaction) {
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
            resolve();
        };
        transaction.onerror = (event) => {
            reject(event);
        };
    });
}
export class IndexedDBStorage {
    constructor(dbName = "IndexedDBStorage", storeName = "linejs") {
        _IndexedDBStorage_db.set(this, void 0);
        this.dbName = dbName;
        this.storeName = storeName;
    }
    addhandler(db) {
        db.onversionchange = () => {
            db.close();
            this.onclose && this.onclose();
        };
    }
    async open() {
        if (!__classPrivateFieldGet(this, _IndexedDBStorage_db, "f")) {
            const request = indexedDB.open(this.dbName);
            request.onblocked = () => {
                this.onblocked && this.onblocked();
            };
            request.onupgradeneeded = () => {
                const db = request.result;
                db.createObjectStore(this.storeName, { keyPath: "key" });
            };
            __classPrivateFieldSet(this, _IndexedDBStorage_db, await successToPromise(request), "f");
            this.addhandler(__classPrivateFieldGet(this, _IndexedDBStorage_db, "f"));
        }
        return __classPrivateFieldGet(this, _IndexedDBStorage_db, "f");
    }
    async set(key, value) {
        const db = await this.open();
        const transaction = db.transaction(this.storeName, "readwrite");
        const success = successToPromise(transaction.objectStore(this.storeName).put({ key, value }));
        const complete = completeToPromise(transaction);
        await success;
        await complete;
    }
    async get(key) {
        const db = await this.open();
        const transaction = db.transaction(this.storeName);
        const complete = completeToPromise(transaction);
        const value = await successToPromise(transaction.objectStore(this.storeName).get(key));
        await complete;
        return value && value.value;
    }
    async delete(key) {
        const db = await this.open();
        const transaction = db.transaction(this.storeName, "readwrite");
        const success = successToPromise(transaction.objectStore(this.storeName).delete(key));
        const complete = completeToPromise(transaction);
        await success;
        await complete;
    }
    async clear() {
        const db = await this.open();
        const version = db.version;
        db.close();
        const request = indexedDB.open(this.dbName, version + 1);
        request.onblocked = () => {
            this.onblocked && this.onblocked();
        };
        request.onupgradeneeded = () => {
            const db = request.result;
            db.deleteObjectStore(this.storeName);
            db.createObjectStore(this.storeName, { keyPath: "key" });
        };
        __classPrivateFieldSet(this, _IndexedDBStorage_db, await successToPromise(request), "f");
        this.addhandler(__classPrivateFieldGet(this, _IndexedDBStorage_db, "f"));
    }
    async migrate(storage) {
        const db = await this.open();
        const transaction = db.transaction(this.storeName, "readwrite");
        const complete = completeToPromise(transaction);
        const objectStore = transaction.objectStore(this.storeName);
        const request = objectStore.openCursor();
        const { promise, resolve } = Promise.withResolvers();
        const promises = [];
        request.onsuccess = () => {
            const cursor = request.result;
            if (cursor) {
                const { value, key } = cursor.value;
                promises.push(storage.set(key, value));
                cursor.continue();
            }
            else {
                resolve();
            }
        };
        await Promise.all(promises);
        await promise;
        await complete;
    }
}
_IndexedDBStorage_db = new WeakMap();
//# sourceMappingURL=indexedDB.js.map