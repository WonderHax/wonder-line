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
var _Square_client, _SquareChat_client, _SquareChat_isPolling;
import { continueRequest } from "../../../base/mod.ts";
import { SquareMessage } from "../message/mod.ts";
import { TypedEventEmitter } from "../../../base/core/typed-event-emitter/index.ts";
/**
 * Square(Openchat) (not a SquareChat)
 */
export class Square {
    constructor(init) {
        _Square_client.set(this, void 0);
        this.raw = init.raw;
        __classPrivateFieldSet(this, _Square_client, init.client, "f");
    }
    /** Updates square information */
    async update() {
        this.raw = (await __classPrivateFieldGet(this, _Square_client, "f").base.square.getSquare({
            squareMid: this.raw.mid,
        }))
            .square;
    }
    async updateSquare(input) {
        return await __classPrivateFieldGet(this, _Square_client, "f").base.square.updateSquare({
            request: {
                updatedAttrs: input.updatedAttrs,
                square: { ...this.raw, ...input.square },
            },
        });
    }
    async updateName(name) {
        return await this.updateSquare({
            updatedAttrs: ["NAME"],
            square: { name },
        });
    }
    /** OpenChat mid */
    get mid() {
        return this.raw.mid;
    }
    /** OpenChat Name */
    get name() {
        return this.raw.name;
    }
}
_Square_client = new WeakMap();
export class SquareChat extends TypedEventEmitter {
    constructor(init) {
        super();
        _SquareChat_client.set(this, void 0);
        _SquareChat_isPolling.set(this, false);
        this.raw = init.raw;
        __classPrivateFieldSet(this, _SquareChat_client, init.client, "f");
    }
    /** Updates square information */
    async update() {
        this.raw = (await __classPrivateFieldGet(this, _SquareChat_client, "f").base.square.getSquareChat({
            squareChatMid: this.raw.squareChatMid,
        }))
            .squareChat;
    }
    async sendMessage(input) {
        if (typeof input === "string") {
            return this.sendMessage({ text: input });
        }
        return await __classPrivateFieldGet(this, _SquareChat_client, "f").base.square.sendMessage({
            ...input,
            squareChatMid: this.raw.squareChatMid,
        });
    }
    async updateSquareChat(input) {
        return await __classPrivateFieldGet(this, _SquareChat_client, "f").base.square.updateSquareChat({
            request: {
                updatedAttrs: input.updatedAttrs,
                squareChat: { ...this.raw, ...input.squareChat },
            },
        });
    }
    async updateName(name) {
        return await this.updateSquareChat({
            updatedAttrs: ["NAME"],
            squareChat: { name },
        });
    }
    async getMembers() {
        const res = await continueRequest({
            handler: (arg) => __classPrivateFieldGet(this, _SquareChat_client, "f").base.square.getSquareChatMembers(arg),
            arg: {
                squareChatMid: this.raw.squareChatMid,
            },
        });
        return res.squareChatMembers;
    }
    /**
     * @description start listen (fetchSquareChatEvents)
     */
    async listen(param = {}) {
        if (__classPrivateFieldGet(this, _SquareChat_isPolling, "f")) {
            throw new Error("Polling has already started");
        }
        __classPrivateFieldSet(this, _SquareChat_isPolling, true, "f");
        let syncToken = param.syncToken;
        if (!syncToken) {
            while (true) {
                const noneEvent = await __classPrivateFieldGet(this, _SquareChat_client, "f").base.square
                    .fetchSquareChatEvents({
                    squareChatMid: this.raw.squareChatMid,
                    syncToken,
                });
                syncToken = noneEvent.syncToken;
                if (noneEvent.events.length === 0) {
                    break;
                }
            }
        }
        this.emit("update:syncToken", syncToken);
        while (!param.signal?.aborted && __classPrivateFieldGet(this, _SquareChat_client, "f").base.authToken) {
            try {
                const response = await __classPrivateFieldGet(this, _SquareChat_client, "f").base.square
                    .fetchSquareChatEvents({
                    squareChatMid: this.raw.squareChatMid,
                    syncToken: syncToken,
                });
                if (syncToken !== response.syncToken) {
                    this.emit("update:syncToken", response.syncToken);
                    syncToken = response.syncToken;
                }
                for (const event of response.events) {
                    this.emit("event", event);
                    if (event.type === "SEND_MESSAGE" &&
                        event.payload.sendMessage) {
                        const message = new SquareMessage({
                            client: __classPrivateFieldGet(this, _SquareChat_client, "f"),
                            raw: event.payload.sendMessage.squareMessage,
                        });
                        this.emit("message", message);
                    }
                    else if (event.type === "RECEIVE_MESSAGE" &&
                        event.payload.receiveMessage) {
                        const message = new SquareMessage({
                            client: __classPrivateFieldGet(this, _SquareChat_client, "f"),
                            raw: event.payload.receiveMessage.squareMessage,
                        });
                        this.emit("message", message);
                        if (message.getTextDecorations().some((e) => e.mention && e.mention.mid === __classPrivateFieldGet(this, _SquareChat_client, "f").base.profile?.mid)) {
                            this.emit("mention", message);
                        }
                    }
                    else if (event.type === "NOTIFIED_KICKOUT_FROM_SQUARE" &&
                        event.payload.notifiedKickoutFromSquare) {
                        this.emit("kick", event.payload.notifiedKickoutFromSquare);
                    }
                    else if (event.type === "NOTIFIED_LEAVE_SQUARE_CHAT" &&
                        event.payload.notifiedLeaveSquareChat) {
                        this.emit("leave", event.payload.notifiedLeaveSquareChat);
                    }
                    else if (event.type === "NOTIFIED_JOIN_SQUARE_CHAT" &&
                        event.payload.notifiedJoinSquareChat) {
                        this.emit("join", event.payload.notifiedJoinSquareChat);
                    }
                    else if (event.type === "NOTIFIED_DESTROY_MESSAGE" &&
                        event.payload.notifiedDestroyMessage) {
                        this.emit("destroy", event.payload.notifiedDestroyMessage);
                    }
                }
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            catch (e) {
                if (param.onError)
                    param.onError(e);
                await new Promise((resolve) => setTimeout(resolve, 2000));
            }
        }
    }
    /** OpenChat mid */
    get mid() {
        return this.raw.squareChatMid;
    }
    /** OpenChat Name */
    get name() {
        return this.raw.name;
    }
}
_SquareChat_client = new WeakMap(), _SquareChat_isPolling = new WeakMap();
//# sourceMappingURL=mod.js.map