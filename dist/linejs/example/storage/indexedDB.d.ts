import type { BaseStorage } from "@evex/linejs/storage";
export declare class IndexedDBStorage implements BaseStorage {
    #private;
    onclose?: () => void;
    onblocked?: () => void;
    dbName: string;
    storeName: string;
    constructor(dbName?: string, storeName?: string);
    addhandler(db: IDBDatabase): void;
    open(): Promise<IDBDatabase>;
    set(key: string, value: any): Promise<void>;
    get(key: string): Promise<any | undefined>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    migrate(storage: BaseStorage): Promise<void>;
}
//# sourceMappingURL=indexedDB.d.ts.map