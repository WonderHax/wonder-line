import { openKv } from "npm:@deno/kv";
/**
 * @classdesc Deno.Kv Storage for LINE Client
 * @constructor
 */
export class DenoKvStorage {
    constructor(path) {
        this.useDeno = true;
        this.kvPrefix = "LINEJS_Storage";
        if (typeof globalThis.Deno === "undefined") {
            this.useDeno = false;
        }
        else if (typeof Deno.openKv === "undefined") {
            console.warn("info: Deno.openKv() is an unstable API.\nhint: Run again with `--unstable-kv` flag to enable this API.");
            this.useDeno = false;
        }
        this.path = path;
    }
    async set(key, value) {
        if (!this.kv) {
            if (this.useDeno) {
                this.kv = await Deno.openKv(this.path);
            }
            else {
                this.kv = await openKv(this.path);
            }
        }
        await this.kv.set([this.kvPrefix, key], value);
    }
    async get(key) {
        if (!this.kv) {
            if (this.useDeno) {
                this.kv = await Deno.openKv(this.path);
            }
            else {
                this.kv = await openKv(this.path);
            }
        }
        return (await this.kv.get([this.kvPrefix, key])).value;
    }
    async delete(key) {
        if (!this.kv) {
            if (this.useDeno) {
                this.kv = await Deno.openKv(this.path);
            }
            else {
                this.kv = await openKv(this.path);
            }
        }
        await this.kv.delete([this.kvPrefix, key]);
    }
    async clear() {
        if (!this.kv) {
            if (this.useDeno) {
                this.kv = await Deno.openKv(this.path);
            }
            else {
                this.kv = await openKv(this.path);
            }
        }
        const entries = this.kv.list({ prefix: [this.kvPrefix] });
        for await (const entry of entries) {
            await this.kv.delete(entry.key);
        }
    }
    async migrate(storage) {
        if (!this.kv) {
            if (this.useDeno) {
                this.kv = await Deno.openKv(this.path);
            }
            else {
                this.kv = await openKv(this.path);
            }
        }
        const entries = this.kv.list({ prefix: [this.kvPrefix] });
        for await (const entry of entries) {
            const key = (entry.key.at(1) || "").toString();
            if (key) {
                await storage.set(key, (await this.kv.get(entry.key)).value);
            }
        }
    }
}
//# sourceMappingURL=denokv.js.map