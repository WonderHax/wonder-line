import { BaseStorage, type Storage } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/storage/base.ts";
/**
 * @lassdesc Mmemory Storage for LINE Client
 * @constructor
 */
export declare class MemoryStorage extends BaseStorage {
    /**
     * Create a new MemoryStorage instance, with initial data.
     *
     * @param {Record<Storage["Key"], Storage["Value"]>} [extendData] - Initial data to be stored in the memory storage.
     */
    constructor(extendData?: Record<Storage["Key"], Storage["Value"]>);
    private data;
    set(key: Storage["Key"], value: Storage["Value"]): Promise<void>;
    get(key: Storage["Key"]): Promise<Storage["Value"] | undefined>;
    delete(key: Storage["Key"]): Promise<void>;
    clear(): Promise<void>;
    getAll(): Record<Storage["Key"], Storage["Value"]>;
    migrate(storage: BaseStorage): Promise<void>;
}
//# sourceMappingURL=memory.d.ts.map