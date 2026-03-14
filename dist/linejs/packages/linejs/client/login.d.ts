/**
 * linejs client.
 * @module
 */
import type { FetchLike } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/linejs/base/mod.ts";
import type { Device } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/linejs/base/mod.ts";
import type { BaseStorage } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/linejs/base/storage/mod.ts";
import { Client } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/linejs/client/client.ts";
export interface InitOptions {
    /**
     * version which LINE App to emulating
     */
    version?: string;
    /**
     * API Endpoint
     * @default "legy.line-apps.com"
     */
    endpoint?: string;
    /**
     * Device
     */
    device: Device;
    /**
     * Storage
     * @default MemoryStorage
     */
    storage?: BaseStorage;
    /**
     * Custom function to connect network.
     * @default `globalThis.fetch`
     */
    fetch?: FetchLike;
}
export interface WithQROptions {
    onReceiveQRUrl(url: string): Promise<void> | void;
    onPincodeRequest(pin: string): void | Promise<void>;
}
export declare const loginWithQR: (opts: WithQROptions, init: InitOptions) => Promise<Client>;
export interface WithPasswordOptions {
    email: string;
    password: string;
    /** @default 114514 */
    pincode?: string;
    onPincodeRequest(pin: string): void | Promise<void>;
}
export declare const loginWithPassword: (opts: WithPasswordOptions, init: InitOptions) => Promise<Client>;
export declare const loginWithAuthToken: (authToken: string, init: InitOptions) => Promise<Client>;
//# sourceMappingURL=login.d.ts.map