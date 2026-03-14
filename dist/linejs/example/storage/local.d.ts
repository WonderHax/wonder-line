import type { BaseStorage, Storage } from "@evex/linejs/storage";
export declare class LocalStorage implements BaseStorage {
    prefix: string;
    constructor();
    set(key: Storage["Key"], value: Storage["Value"]): Promise<void>;
    get(key: Storage["Key"]): Promise<Storage["Value"] | undefined>;
    delete(key: Storage["Key"]): Promise<void>;
    clear(): Promise<void>;
    migrate(storage: BaseStorage): Promise<void>;
}
//# sourceMappingURL=local.d.ts.map