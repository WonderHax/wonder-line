/**
 * Develop now
 * @experimental
 * for square
 */
import * as LINETypes from "@evex/linejs-types";
import { continueRequest } from "../core/mod.ts";
import { TypedEventEmitter } from "../core/typed-event-emitter/index.ts";
import { SquareMessage } from "./message-class.ts";
import { Note } from "./talk-class.ts";
/**
 * @description LINE square (Openchat) utils
 */
export class Square extends TypedEventEmitter {
    constructor(rawSouce, client, autoUpdate = true) {
        super();
        this.rawSouce = rawSouce;
        this.client = client;
        const { square, noteStatus, myMembership, squareAuthority, squareStatus, squareFeatureSet, } = rawSouce;
        this.mid = square.mid;
        this.name = square.name;
        this.profileImageObsHash = square.profileImageObsHash;
        this.desc = square.desc;
        this.searchable = square.searchable;
        this.type = square.type;
        this.invitationURL = square.invitationURL;
        this.revision = square.revision;
        this.state = square.state;
        this.emblems = square.emblems;
        this.joinMethod = square.joinMethod;
        this.createdAt = new Date(square.createdAt);
        this.me = new SquareMember(myMembership, client);
        this.authority = squareAuthority;
        this.noteStatus = noteStatus;
        this.note = new Note(this.mid, this.client);
        this.feature = squareFeatureSet;
        this.status = squareStatus;
        this.memberCount = squareStatus.memberCount;
        this.joinRequestCount = squareStatus.joinRequestCount;
        this.lastJoinRequestAt = new Date(squareStatus.lastJoinRequestAt);
        this.openChatCount = squareStatus.openChatCount;
        if (autoUpdate) {
            client.on("square:event", (event) => {
                if (event.payload.notifiedUpdateSquareFeatureSet &&
                    event.payload.notifiedUpdateSquareFeatureSet
                        .squareFeatureSet
                        .squareMid === this.mid) {
                    this.feature = event.payload.notifiedUpdateSquareFeatureSet
                        .squareFeatureSet;
                    this.emit("update", this);
                    this.emit("update:feature", this.feature);
                }
                else if (event.payload.notifiedUpdateSquareStatus &&
                    event.payload.notifiedUpdateSquareStatus.squareMid ===
                        this.mid) {
                    this.status = event.payload.notifiedUpdateSquareStatus.squareStatus;
                    this.emit("update", this);
                    this.emit("update:status", this.status);
                }
                else if (event.payload.notificationJoinRequest &&
                    event.payload.notificationJoinRequest.squareMid === this.mid) {
                    this.emit("joinrequest", event.payload.notificationJoinRequest);
                }
                else if (event.payload.notifiedUpdateSquareNoteStatus &&
                    event.payload.notifiedUpdateSquareNoteStatus.squareMid ===
                        this.mid) {
                    this.noteStatus =
                        event.payload.notifiedUpdateSquareNoteStatus.noteStatus;
                    this.emit("update", this);
                    this.emit("update:note", this.noteStatus);
                }
                else if (event.payload.notifiedUpdateSquareAuthority &&
                    event.payload.notifiedUpdateSquareAuthority.squareMid ===
                        this.mid) {
                    this.authority = event.payload.notifiedUpdateSquareAuthority
                        .squareAuthority;
                    this.emit("update", this);
                    this.emit("update:authority", this.authority);
                }
                else if (event.payload.notifiedShutdownSquare &&
                    event.payload.notifiedShutdownSquare.square.mid === this.mid) {
                    const { square } = event.payload.notifiedShutdownSquare;
                    this.mid = square.mid;
                    this.name = square.name;
                    this.profileImageObsHash = square.profileImageObsHash;
                    this.desc = square.desc;
                    this.searchable = square.searchable;
                    this.type = square.type;
                    this.invitationURL = square.invitationURL;
                    this.revision = square.revision;
                    this.state = square.state;
                    this.emblems = square.emblems;
                    this.joinMethod = square.joinMethod;
                    this.createdAt = new Date(square.createdAt);
                    this.emit("update", this);
                    this.emit("shutdown", square);
                }
                else if (event.payload.notifiedUpdateSquare &&
                    event.payload.notifiedUpdateSquare.squareMid === this.mid) {
                    const { square } = event.payload.notifiedUpdateSquare;
                    this.mid = square.mid;
                    this.name = square.name;
                    this.profileImageObsHash = square.profileImageObsHash;
                    this.desc = square.desc;
                    this.searchable = square.searchable;
                    this.type = square.type;
                    this.invitationURL = square.invitationURL;
                    this.revision = square.revision;
                    this.state = square.state;
                    this.emblems = square.emblems;
                    this.joinMethod = square.joinMethod;
                    this.createdAt = new Date(square.createdAt);
                    this.emit("update", this);
                    this.emit("update:square", square);
                }
            });
        }
    }
    /**
     * @description Generate from mid.
     */
    static async from(squareMid, client) {
        return new this(await client.square.getSquare({ squareMid }), client);
    }
}
/**
 * @description LINE squareChat (Openchat) utils
 */
export class SquareChat extends TypedEventEmitter {
    constructor(rawSouce, client, polling = false, autoUpdate = true) {
        super();
        this.rawSouce = rawSouce;
        this.client = client;
        this.polling_delay = 2000;
        this.IS_POLLING = false;
        const { squareChat, squareChatMember, squareChatStatus } = rawSouce;
        this.mid = squareChat.squareChatMid;
        this.squareMid = squareChat.squareMid;
        this.type = squareChat.type;
        this.name = squareChat.name;
        this.chatImageObsHash = squareChat.chatImageObsHash;
        this.squareChatRevision = squareChat.squareChatRevision;
        this.maxMemberCount = squareChat.maxMemberCount;
        this.state = squareChat.state;
        this.invitationUrl = squareChat.invitationUrl;
        this.messageVisibility = squareChat.messageVisibility;
        this.ableToSearchMessage = [null, false, true][LINETypes.enums.BooleanState[squareChat.ableToSearchMessage]];
        this.mymid = squareChatMember.squareMemberMid;
        this.memberCount = squareChatStatus.otherStatus.memberCount;
        this.status = squareChatStatus.otherStatus;
        this.note = new Note(this.squareMid, this.client);
        if (polling) {
            this.polling();
        }
        if (autoUpdate) {
            client.on("square:event", (event) => {
                if (event.payload.notifiedUpdateSquareChatStatus &&
                    event.payload.notifiedUpdateSquareChatStatus
                        .squareChatMid ===
                        this.mid) {
                    this.status = event.payload.notifiedUpdateSquareChatStatus
                        .statusWithoutMessage;
                    this.memberCount = this.status.memberCount;
                    this.emit("update", this);
                    this.emit("update:status", this.status);
                }
                else if (event.payload.notifiedUpdateSquareChat &&
                    event.payload.notifiedUpdateSquareChat.squareChatMid ===
                        this.mid) {
                    const { squareChat } = event.payload.notifiedUpdateSquareChat;
                    this.mid = squareChat.squareChatMid;
                    this.squareMid = squareChat.squareMid;
                    this.type = squareChat.type;
                    this.name = squareChat.name;
                    this.chatImageObsHash = squareChat.chatImageObsHash;
                    this.squareChatRevision = squareChat
                        .squareChatRevision;
                    this.maxMemberCount = squareChat.maxMemberCount;
                    this.state = squareChat.state;
                    this.invitationUrl = squareChat.invitationUrl;
                    this.messageVisibility = squareChat.messageVisibility;
                    this.ableToSearchMessage = [null, false, true][LINETypes.enums.BooleanState[squareChat.ableToSearchMessage]];
                    this.emit("update", this);
                    this.emit("update:chat", squareChat);
                }
            });
            if (polling) {
                this.on("event", (_event) => { });
            }
        }
    }
    /**
     * @description Generate from mid.
     */
    static async from(squareChatMid, client, polling = true) {
        return new this(await client.square.getSquareChat({ squareChatMid }), client, polling);
    }
    async getMembers() {
        const r = await continueRequest({
            handler: (param) => this.client.square.getSquareChatMembers(param),
            arg: { squareChatMid: this.mid },
        });
        return r.squareChatMembers.map((e) => new SquareMember(e, this.client));
    }
    /**
     * @description Send msg to square.
     */
    async send(options) {
        if (typeof options === "string") {
            return await this.send({ text: options });
        }
        else {
            const _options = options;
            _options.squareChatMid = this.mid;
            return await this.client.square.sendMessage(_options);
        }
    }
    /**
     * @description start listen (fetchSquareChatEvents)
     */
    async polling() {
        if (!this.syncToken) {
            while (true) {
                const noneEvent = await this.client.square
                    .fetchSquareChatEvents({
                    squareChatMid: this.mid,
                    syncToken: this.syncToken,
                });
                this.syncToken = noneEvent.syncToken;
                if (noneEvent.events.length === 0) {
                    break;
                }
            }
        }
        this.IS_POLLING = true;
        this.emit("update:syncToken", this.syncToken);
        while (this.IS_POLLING && this.client.authToken) {
            try {
                const response = await this.client.square.fetchSquareChatEvents({
                    squareChatMid: this.mid,
                    syncToken: this.syncToken,
                });
                if (this.syncToken !== response.syncToken) {
                    this.emit("update:syncToken", response.syncToken);
                    this.syncToken = response.syncToken;
                }
                for (const event of response.events) {
                    this.emit("event", event);
                    if (event.type === "SEND_MESSAGE" &&
                        event.payload.sendMessage) {
                        const message = new SquareMessage({
                            squareEventSendMessage: event.payload.sendMessage,
                        }, this.client);
                        this.emit("message", message);
                    }
                    else if (event.type === "RECEIVE_MESSAGE" &&
                        event.payload.receiveMessage) {
                        const message = new SquareMessage({
                            squareEventReceiveMessage: event.payload.receiveMessage,
                        }, this.client);
                        this.emit("message", message);
                    }
                }
                await new Promise((resolve) => setTimeout(resolve, this.polling_delay));
            }
            catch (error) {
                this.client.log("SquareChatPollingError", { error });
                await new Promise((resolve) => setTimeout(resolve, this.polling_delay));
            }
        }
    }
}
/**
 * @description LINE squareMember (Openchat user) utils
 */
export class SquareMember extends TypedEventEmitter {
    constructor(rawMember, client) {
        super();
        this.rawMember = rawMember;
        this.client = client;
        this.mid = rawMember.squareMemberMid;
        this.squareMid = rawMember.squareMid;
        this.displayName = rawMember.displayName;
        this.profileImageObsHash = rawMember.profileImageObsHash;
        this.ableToReceiveMessage = rawMember.ableToReceiveMessage;
        this.membershipState = rawMember.membershipState;
        this.role = rawMember.role;
        this.revision = rawMember.revision;
        this.preference = rawMember.preference;
        this.joinMessage = rawMember.joinMessage;
    }
    /**
     * @description Generate from mid.
     */
    static async from(squareMemberMid, client) {
        return new this(await client.square.getSquareMember({ squareMemberMid })
            .then((r) => r.squareMember), client);
    }
}
//# sourceMappingURL=square-class.js.map