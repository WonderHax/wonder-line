import { type Device, type DeviceDetails } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/core/utils/devices.ts";
import { type BaseStorage } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/storage/mod.ts";
import { TypedEventEmitter } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/core/typed-event-emitter/index.ts";
import type { ClientEvents, Log } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/core/utils/events.ts";
import { InternalError } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/core/utils/error.ts";
import { type Continuable, continueRequest } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/core/utils/continue.ts";
export type { Continuable, Device, DeviceDetails, Log };
export { continueRequest, InternalError };
import { AuthService, CallService, ChannelService, LiffService, RelationService, SquareLiveTalkService, SquareService, TalkService } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/service/mod.ts";
import { Login } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/login/mod.ts";
import { Thrift } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/thrift/mod.ts";
import { RequestClient } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/request/mod.ts";
import { E2EE } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/e2ee/mod.ts";
import { LineObs } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/obs/mod.ts";
import { Timeline } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/timeline/mod.ts";
import { Polling } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/polling/mod.ts";
import { ConnManager } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/push/mod.ts";
import type * as LINETypes from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/line_types.ts";
import type { Fetch, FetchLike } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/types.ts";
import type { LooseType } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/thrift.ts";
export interface LoginOption {
    email?: string;
    password?: string;
    pincode?: string;
    authToken?: string;
    qr?: boolean;
    e2ee?: boolean;
    v3?: boolean;
}
export interface ClientInit {
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
export interface Config {
    /**
     * Timeout
     * @default 30_000
     */
    timeout: number;
    /**
     * Long timeout
     * @default 180_000
     */
    longTimeout: number;
}
/**
 * LINE.js client, which is entry point.
 */
export declare class BaseClient extends TypedEventEmitter<ClientEvents> {
    #private;
    authToken?: string;
    readonly device: Device;
    readonly loginProcess: Login;
    readonly thrift: Thrift;
    readonly request: RequestClient;
    readonly storage: BaseStorage;
    readonly e2ee: E2EE;
    readonly obs: LineObs;
    readonly timeline: Timeline;
    readonly poll: Polling;
    readonly push: ConnManager;
    readonly auth: AuthService;
    readonly call: CallService;
    readonly channel: ChannelService;
    readonly liff: LiffService;
    readonly relation: RelationService;
    readonly livetalk: SquareLiveTalkService;
    readonly square: SquareService;
    readonly talk: TalkService;
    profile?: LINETypes.Profile;
    config: Config;
    readonly deviceDetails: DeviceDetails;
    readonly endpoint: string;
    /**
     * Initializes a new instance of the class.
     *
     * @param init - The initialization parameters.
     * @param init.device - The device type.
     * @param init.version - The version of the device.
     * @param init.fetch - Optional custom fetch function.
     * @param init.endpoint - Optional endpoint URL.
     * @param init.storage - Optional storage mechanism.
     *
     * @throws {Error} If the device is unsupported.
     *
     * @example
     * ```typescript
     * const client = new Client({
     *   device: 'iOS',
     *   version: '10.0',
     *   fetch: customFetchFunction,
     *   endpoint: 'custom-endpoint.com',
     *   storage: new FileStorage("./storage.json"),
     * });
     * ```
     */
    constructor(init: ClientInit);
    log(type: string, data: Record<string, LooseType>): void;
    getToType(mid: string): number | null;
    reqseqs?: Record<string, number>;
    getReqseq(name?: string): Promise<number>;
    readonly fetch: Fetch;
    /**
     * returns polling client.
     */
    createPolling(): Polling;
    /**
     * JSON replacer to remove mid and authToken, parse bigint to number
     *
     * ```
     * JSON.stringify(data, BaseClient.jsonReplacer);
     * ```
     */
    static jsonReplacer(k: LooseType, v: LooseType): LooseType;
}
//# sourceMappingURL=mod.d.ts.map