import type { BaseStorage } from "@evex/linejs/storage";
import { type Kv } from "npm:@deno/kv";
/**
 * @classdesc Deno.Kv Storage for LINE Client
 * @constructor
 */
export declare class DenoKvStorage implements BaseStorage {
    useDeno: boolean;
    kv?: Deno.Kv | Kv;
    path?: string;
    kvPrefix: string;
    constructor(path?: string);
    set(key: string, value: any): Promise<void>;
    get(key: string): Promise<any | undefined>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    migrate(storage: BaseStorage): Promise<void>;
}
//# sourceMappingURL=denokv.d.ts.map