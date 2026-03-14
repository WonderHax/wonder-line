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
var _Chat_client;
import { TalkMessage } from "../message/talk.ts";
import { createMessageFetcher } from "./fetcher.ts";
/**
 * Talk chat(group) class (not a OpenChat)
 */
export class Chat {
    constructor(init) {
        _Chat_client.set(this, void 0);
        __classPrivateFieldSet(this, _Chat_client, init.client, "f");
        this.mid = init.raw.chatMid;
        this.name = init.raw.chatName;
        this.raw = init.raw;
    }
    /**
     * Sends message to the chat(group).
     */
    async sendMessage(input) {
        if (typeof input === "string") {
            return this.sendMessage({ text: input });
        }
        const sent = await __classPrivateFieldGet(this, _Chat_client, "f").base.talk.sendMessage({
            to: this.mid,
            text: input.text,
            e2ee: input.e2ee !== false, // undefined -> true
            chunks: input.chunk,
            contentMetadata: input.contentMetadata,
            contentType: input.contentType,
            relatedMessageId: input.relatedMessageId,
            location: input.location,
        });
        return TalkMessage.fromRawTalk({
            ...sent,
            to: this.mid,
        }, __classPrivateFieldGet(this, _Chat_client, "f"));
    }
    /**
     * @description Update chat(group) status.
     */
    async updateChat(options) {
        return await __classPrivateFieldGet(this, _Chat_client, "f").base.talk.updateChat({
            request: {
                updatedAttribute: options.updatedAttribute,
                chat: options.chat,
                reqSeq: await __classPrivateFieldGet(this, _Chat_client, "f").base.getReqseq(),
            },
        });
    }
    /**
     * @description Update chat(group) name.
     */
    async updateName(name) {
        return await this.updateChat({
            chat: { chatName: name },
            updatedAttribute: "NAME",
        });
    }
    /**
     * @description Invite user.
     */
    async invite(mids) {
        return await __classPrivateFieldGet(this, _Chat_client, "f").base.talk.inviteIntoChat({
            targetUserMids: mids,
            chatMid: this.mid,
        });
    }
    /**
     * @description Kickout user.
     */
    kick(mid) {
        return __classPrivateFieldGet(this, _Chat_client, "f").base.talk.deleteOtherFromChat({
            request: {
                targetUserMids: [mid],
                chatMid: this.mid,
            },
        });
    }
    /**
     * @description Leave chat.
     */
    leave() {
        return __classPrivateFieldGet(this, _Chat_client, "f").base.talk.deleteSelfFromChat({
            request: {
                chatMid: this.mid,
            },
        });
    }
    /**
     * Fetches messages from the chat(group).
     *
     * @param limit The number of messages to fetch. Defaults to 10.
     * @returns A promise that resolves to an array of TalkMessage instances.
     */
    async fetchMessages(limit = 10) {
        const boxes = await __classPrivateFieldGet(this, _Chat_client, "f").base.talk.getMessageBoxes({
            messageBoxListRequest: {},
        });
        const box = boxes.messageBoxes.find((box) => box.id === this.mid);
        if (!box) {
            throw new Error("Message box not found.");
        }
        const messages = await __classPrivateFieldGet(this, _Chat_client, "f").base.talk
            .getPreviousMessagesV2WithRequest({
            request: {
                messageBoxId: box.id,
                endMessageId: {
                    messageId: box.lastDeliveredMessageId.messageId,
                    deliveredTime: box.lastDeliveredMessageId.deliveredTime,
                },
                messagesCount: limit,
            },
        });
        return await Promise.all(messages.map((message) => TalkMessage.fromRawTalk(message, __classPrivateFieldGet(this, _Chat_client, "f"))));
    }
    messageFetcher() {
        return createMessageFetcher(__classPrivateFieldGet(this, _Chat_client, "f"), this);
    }
}
_Chat_client = new WeakMap();
//# sourceMappingURL=mod.js.map