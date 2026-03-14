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
var _TalkMessage_instances, _TalkMessage_client, _TalkMessage_content_get, _UnresolvedTalkMessage_client;
import { InternalError } from "../../../base/core/mod.ts";
const hasContents = ["IMAGE", "VIDEO", "AUDIO", "FILE"];
export class TalkMessage {
    constructor(init) {
        _TalkMessage_instances.add(this);
        _TalkMessage_client.set(this, void 0);
        this.isSquare = false;
        this.isTalk = true;
        __classPrivateFieldSet(this, _TalkMessage_client, init.client, "f");
        this.raw = init.raw;
    }
    /**
     * Replys to message.
     */
    async reply(input) {
        if (typeof input === "string") {
            return this.reply({
                text: input,
            });
        }
        let to;
        if (this.to.type === "GROUP" || this.to.type === "ROOM") {
            to = this.to.id; // this.to means it is group.
        }
        else {
            // Personal chats
            to = this.isMyMessage ? this.to.id : this.from.id;
        }
        await __classPrivateFieldGet(this, _TalkMessage_client, "f").base.talk.sendMessage({
            relatedMessageId: this.raw.id,
            text: input.text,
            to,
            e2ee: input.e2ee || Boolean(this.raw.chunks),
            contentMetadata: input.contentMetadata,
        });
    }
    /**
     * Sends to message.
     */
    async send(input) {
        if (typeof input === "string") {
            return this.reply({
                text: input,
            });
        }
        let to;
        if (this.to.type === "GROUP" || this.to.type === "ROOM") {
            to = this.to.id; // this.to means it is group.
        }
        else {
            // Personal chats
            to = this.isMyMessage ? this.to.id : this.from.id;
        }
        await __classPrivateFieldGet(this, _TalkMessage_client, "f").base.talk.sendMessage({
            to,
            e2ee: input.e2ee || Boolean(this.raw.chunks),
        });
    }
    /**
     * Reacts to message.
     */
    async react(type) {
        await __classPrivateFieldGet(this, _TalkMessage_client, "f").base.talk.react({
            id: BigInt(this.raw.id),
            reaction: type,
        });
    }
    /**
     * Read the message.
     */
    async read() {
        await __classPrivateFieldGet(this, _TalkMessage_client, "f").base.talk.sendChatChecked({
            chatMid: this.isMyMessage ? this.to.id : this.from.id,
            lastMessageId: this.raw.id,
            seq: await __classPrivateFieldGet(this, _TalkMessage_client, "f").base.getReqseq(),
        });
    }
    /**
     * Pins the message.
     */
    async announce() {
        if (!this.raw.text) {
            throw new TypeError("The message is not text message.");
        }
        if (this.to.type !== "ROOM" && this.to.type !== "GROUP") {
            throw new TypeError("Cannot announce out of group.");
        }
        await __classPrivateFieldGet(this, _TalkMessage_client, "f").base.talk.createChatRoomAnnouncement({
            chatRoomMid: this.to.id,
            type: "MESSAGE",
            contents: {
                text: this.raw.text,
                link: `line://nv/chatMsg?chatId=${this.to.id}&messageId=${this.raw.id}`,
            },
        });
    }
    /**
     * Unsends the message.
     */
    async unsend() {
        if (!this.isMyMessage) {
            throw new TypeError("Cannot unsend the message which is not yours.");
        }
        await __classPrivateFieldGet(this, _TalkMessage_client, "f").base.talk.unsendMessage({
            messageId: this.raw.id,
        });
    }
    /**
     * Gets sticker URL.
     * @returns Stamp URL
     */
    getStickerURL() {
        if (this.raw.contentType !== "STICKER") {
            throw new TypeError("The message is not sticker.");
        }
        const stickerMetadata = this.raw
            .contentMetadata;
        if (stickerMetadata.STKOPT === "A") {
            return `https://stickershop.line-scdn.net/stickershop/v1/sticker/${stickerMetadata.STKID}/android/sticker_animation.png`;
        }
        else {
            return `https://stickershop.line-scdn.net/stickershop/v1/sticker/${stickerMetadata.STKID}/android/sticker.png`;
        }
    }
    /**
     * Collects emoji URLs in the message.
     * @returns URLs of emoji
     */
    collectEmojiURLs() {
        if (this.raw.contentType !== "NONE") {
            throw new TypeError("The message is not text message.");
        }
        const emojiUrls = [];
        const emojiData = this.raw.contentMetadata;
        const replace = emojiData?.REPLACE
            ? JSON.parse(emojiData?.REPLACE)
            : undefined;
        const emojiResources = replace?.sticon?.resources ?? [];
        for (const emoji of emojiResources) {
            emojiUrls.push(`https://stickershop.line-scdn.net/sticonshop/v1/sticon/${emoji.productId}/android/${emoji.sticonId}.png`);
        }
        return emojiUrls;
    }
    /**
     * Gets mentions in the message.
     */
    getMentions() {
        const content = __classPrivateFieldGet(this, _TalkMessage_instances, "a", _TalkMessage_content_get);
        if (content.type !== "NONE") {
            throw new TypeError("Message has no text.");
        }
        const mentionees = [];
        const mentionData = content.metadata;
        const mention = mentionData?.MENTION
            ? JSON.parse(mentionData.MENTION)
            : undefined;
        const mentions = mention?.MENTIONEES ?? [];
        for (const mention of mentions) {
            mentionees.push(mention.A
                ? {
                    all: true,
                }
                : {
                    all: false,
                    mid: mention.M,
                });
        }
        return mentionees;
    }
    /**
     * Gets text decorations (emoji, mention)
     */
    getTextDecorations() {
        // TODO: refeactering is needed
        const content = __classPrivateFieldGet(this, _TalkMessage_instances, "a", _TalkMessage_content_get);
        if (content.type !== "NONE") {
            throw new TypeError("Message has no text.");
        }
        const texts = [];
        const splits = [];
        const mentionData = content.metadata;
        const emojiData = content.metadata;
        const mention = mentionData?.MENTION
            ? JSON.parse(mentionData.MENTION)
            : undefined;
        const mentions = mention?.MENTIONEES ?? [];
        mentions.forEach((e, i) => {
            splits.push({
                start: parseInt(e.S),
                end: parseInt(e.E),
                mention: i,
            });
        });
        const replace = emojiData?.REPLACE
            ? JSON.parse(emojiData?.REPLACE)
            : undefined;
        const emojiResources = replace?.sticon?.resources ?? [];
        emojiResources.forEach((e, i) => {
            splits.push({ start: e.S, end: e.E, emoji: i });
        });
        let lastSplit = 0;
        splits
            .sort((a, b) => a.start - b.start)
            .forEach((e) => {
            if (lastSplit - e.start) {
                texts.push({
                    text: this.raw.text?.substring(lastSplit, e.start),
                });
            }
            const content = {
                text: this.raw.text?.substring(e.start, e.end),
            };
            if (typeof e.emoji === "number") {
                const emoji = emojiResources[e.emoji];
                const url = `https://stickershop.line-scdn.net/sticonshop/v1/sticon/${emoji.productId}/android/${emoji.sticonId}.png`;
                content.emoji = {
                    ...emoji,
                    url,
                };
            }
            else if (typeof e.mention === "number") {
                const _mention = mentionData?.MENTION
                    ? JSON.parse(mentionData.MENTION)
                    : undefined;
                const mentions = _mention?.MENTIONEES ?? [];
                const mention = mentions[e.mention];
                content.mention = mention.M
                    ? { mid: mention.M }
                    : { all: !!mention.A };
            }
            texts.push(content);
            lastSplit = e.end;
        });
        texts.push({
            text: this.raw.text?.substring(lastSplit),
        });
        return texts;
    }
    /**
     * Gets a shared contact infomation from the message.
     */
    getSharedContact() {
        if (__classPrivateFieldGet(this, _TalkMessage_instances, "a", _TalkMessage_content_get).type !== "CONTACT") {
            throw new TypeError("The message does not share contact infomation.");
        }
        const contactData = __classPrivateFieldGet(this, _TalkMessage_instances, "a", _TalkMessage_content_get).metadata;
        return { mid: contactData.mid, displayName: contactData.displayName };
    }
    /**
     * Gets flex from the message.
     */
    getFlex() {
        const content = __classPrivateFieldGet(this, _TalkMessage_instances, "a", _TalkMessage_content_get);
        if (content.type !== "FLEX") {
            throw new TypeError("The message has no flex items.");
        }
        const flexData = content.metadata;
        return {
            flexJson: flexData.FLEX_JSON,
            altText: flexData.ALT_TEXT,
            ver: flexData.FLEX_VER,
            tag: flexData.EFFECT_TAG,
        };
    }
    /**
     * Gets reply target.
     * If the message is reply, returns reply target id.
     */
    getReplyTarget() {
        if (this.raw.relatedMessageId &&
            (this.raw.messageRelationType === 3 ||
                this.raw.messageRelationType === "REPLY")) {
            return new UnresolvedTalkMessage(this.raw.relatedMessageId, __classPrivateFieldGet(this, _TalkMessage_client, "f"));
        }
        return null;
    }
    /**
     * @return {Blob} message data
     */
    async getData(preview) {
        if (!hasContents.includes(__classPrivateFieldGet(this, _TalkMessage_instances, "a", _TalkMessage_content_get).type)) {
            throw new TypeError("message have no contents");
        }
        if (this.raw.contentMetadata.DOWNLOAD_URL) {
            if (preview) {
                const r = await __classPrivateFieldGet(this, _TalkMessage_client, "f").base
                    .fetch(this.raw.contentMetadata.PREVIEW_URL);
                return await r.blob();
            }
            else {
                const r = await __classPrivateFieldGet(this, _TalkMessage_client, "f").base
                    .fetch(this.raw.contentMetadata.DOWNLOAD_URL);
                return await r.blob();
            }
        }
        if (this.raw.chunks) {
            const file = await __classPrivateFieldGet(this, _TalkMessage_client, "f").base.obs.downloadMediaByE2EE(this.raw);
            if (!file) {
                throw new InternalError("ObsError", "Download failed");
            }
            return file;
        }
        else {
            return await __classPrivateFieldGet(this, _TalkMessage_client, "f").base.obs.downloadMessageData({
                messageId: this.raw.id,
                isPreview: preview,
                isSquare: false,
            });
        }
    }
    get isMyMessage() {
        return __classPrivateFieldGet(this, _TalkMessage_client, "f").base.profile?.mid === this.from.id;
    }
    get to() {
        const message = this.raw;
        return {
            type: message.toType,
            id: message.to,
        };
    }
    get from() {
        const message = this.raw;
        return {
            type: "USER",
            id: message.from,
        };
    }
    get text() {
        return this.raw.text;
    }
    /*
    static fromSource(
        source: SourceEvent & { type: "talk" },
        client: Client,
    ): Promise<TalkMessage> {
        return this.fromRawTalk(source.event.message, client);
    }
    */
    static async fromRawTalk(raw, client) {
        if (raw.contentMetadata.e2eeVersion) {
            raw = await client.base.e2ee.decryptE2EEMessage(raw);
        }
        return new TalkMessage({
            client,
            raw,
        });
    }
}
_TalkMessage_client = new WeakMap(), _TalkMessage_instances = new WeakSet(), _TalkMessage_content_get = function _TalkMessage_content_get() {
    return {
        type: this.raw.contentType,
        metadata: this.raw.contentMetadata,
    };
};
export class UnresolvedTalkMessage {
    constructor(id, client) {
        _UnresolvedTalkMessage_client.set(this, void 0);
        this.id = id;
        __classPrivateFieldSet(this, _UnresolvedTalkMessage_client, client, "f");
    }
    then(_resolve) {
        throw new Error("Method not implemented.");
    }
}
_UnresolvedTalkMessage_client = new WeakMap();
//# sourceMappingURL=talk.js.map