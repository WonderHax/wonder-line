var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BaseClient_customFetch;
import { getDeviceDetails, } from "./utils/devices.ts";
import { MemoryStorage } from "../storage/mod.ts";
import { TypedEventEmitter } from "./typed-event-emitter/index.ts";
import { InternalError } from "./utils/error.ts";
import { continueRequest } from "./utils/continue.ts";
export { continueRequest, InternalError };
import { AuthService, CallService, ChannelService, LiffService, RelationService, SquareLiveTalkService, SquareService, TalkService, } from "../service/mod.ts";
import { Login } from "../login/mod.ts";
import { Thrift } from "../thrift/mod.ts";
import { RequestClient } from "../request/mod.ts";
import { E2EE } from "../e2ee/mod.ts";
import { LineObs } from "../obs/mod.ts";
import { Timeline } from "../timeline/mod.ts";
import { Polling } from "../polling/mod.ts";
import { ConnManager } from "../push/mod.ts";
import { Thrift as def } from "@evex/linejs-types/thrift";
/**
 * LINE.js client, which is entry point.
 */
export class BaseClient extends TypedEventEmitter {
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
    constructor(init) {
        super();
        _BaseClient_customFetch.set(this, void 0);
        // NOTE: use allow function.
        // `const { fetch } = base` is not working if you change to function decorations.
        this.fetch = async (info, init) => {
            const req = new Request(info, init);
            const res = await (__classPrivateFieldGet(this, _BaseClient_customFetch, "f")
                ? __classPrivateFieldGet(this, _BaseClient_customFetch, "f").call(this, req)
                : globalThis.fetch(req));
            return res;
        };
        const deviceDetails = getDeviceDetails(init.device, init.version);
        if (!deviceDetails) {
            throw new Error(`Unsupported device: ${init.device}.`);
        }
        if (init.fetch) {
            __classPrivateFieldSet(this, _BaseClient_customFetch, init.fetch, "f");
        }
        this.deviceDetails = deviceDetails;
        this.endpoint = init.endpoint ?? "legy.line-apps.com";
        this.config = {
            timeout: 30000,
            longTimeout: 180000,
        };
        this.device = init.device;
        this.storage = init.storage ?? new MemoryStorage();
        this.request = new RequestClient(this);
        this.loginProcess = new Login(this);
        this.thrift = new Thrift();
        this.thrift.def = def;
        this.e2ee = new E2EE(this);
        this.obs = new LineObs(this);
        this.timeline = new Timeline(this);
        this.poll = new Polling(this);
        this.push = new ConnManager(this);
        this.auth = new AuthService(this);
        this.call = new CallService(this);
        this.channel = new ChannelService(this);
        this.liff = new LiffService(this);
        this.livetalk = new SquareLiveTalkService(this);
        this.relation = new RelationService(this);
        this.square = new SquareService(this);
        this.talk = new TalkService(this);
    }
    log(type, data) {
        this.emit("log", { type, data });
    }
    getToType(mid) {
        const typeMapping = {
            u: 0,
            r: 1,
            c: 2,
            s: 3,
            m: 4,
            p: 5,
            v: 6,
            t: 7,
        };
        return typeMapping[mid[0]] ?? null;
    }
    async getReqseq(name = "talk") {
        if (!this.reqseqs) {
            this.reqseqs = JSON.parse(((await this.storage.get("reqseq")) ?? "{}").toString());
        }
        if (!this.reqseqs[name]) {
            this.reqseqs[name] = 0;
        }
        const seq = this.reqseqs[name];
        this.reqseqs[name]++;
        await this.storage.set("reqseq", JSON.stringify(this.reqseqs));
        return seq;
    }
    /**
     * returns polling client.
     */
    createPolling() {
        return this.poll;
    }
    /**
     * JSON replacer to remove mid and authToken, parse bigint to number
     *
     * ```
     * JSON.stringify(data, BaseClient.jsonReplacer);
     * ```
     */
    static jsonReplacer(k, v) {
        if (typeof v === "bigint") {
            //@ts-expect-error https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/JSON/rawJSON
            return JSON.rawJSON(v.toString());
        }
        if (typeof v === "string") {
            const midType = v.match(/([ucrpmst])[0123456789abcdef]{32}/);
            if (midType && midType[1]) {
                return `[${midType[1].toUpperCase()} mid]`;
            }
            if (k === "x-line-access") {
                return `[AuthToken]`;
            }
        }
        if (typeof v === "object") {
            if (Array.isArray(v)) {
                return v.map((item) => BaseClient.jsonReplacer("", item));
            }
            if (v instanceof Uint8Array) {
                return `Uint8Array[${v.length}]<${Array.from(v).map((e) => e.toString(16).padStart(2, "0")).join(" ")}>`;
            }
            if (v.type === "Buffer" && Array.isArray(v.data)) {
                return `Buffer[${v.data.length}]<${Array.from(v.data).map((e) => Number(e).toString(16).padStart(2, "0"))
                    .join(" ")}>`;
            }
            if (v instanceof Blob) {
                return `Blob[${v.size}]@${v.type}`;
            }
            const newObj = {};
            let midCount = 0;
            for (const key in v) {
                if (Object.prototype.hasOwnProperty.call(v, key)) {
                    const value = v[key];
                    const midType = key.match(/(.)[0123456789abcdef]{32}/);
                    if (midType && midType[1]) {
                        midCount++;
                        newObj[`[${midType[1].toUpperCase()} mid ${midCount}]`] = value;
                    }
                    else {
                        newObj[key] = value;
                    }
                }
            }
            return newObj;
        }
        return v;
    }
}
_BaseClient_customFetch = new WeakMap();
//# sourceMappingURL=mod.js.map