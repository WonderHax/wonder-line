import { parseEnum } from "@evex/linejs-types/thrift";
import { TypedEventEmitter } from "../core/typed-event-emitter/index.ts";
import { TalkMessage } from "./message-class.ts";
/**
 * @description Gets mid's type
 *
 * USER(0),\
 * ROOM(1),\
 * GROUP(2),\
 * SQUARE(3),\
 * SQUARE_CHAT(4),\
 * SQUARE_MEMBER(5),\
 * BOT(6);
 */
function getMidType(mid) {
    const _u = mid.charAt(0);
    switch (_u) {
        case "u":
            return parseEnum("MIDType", 0);
        case "r":
            return parseEnum("MIDType", 1);
        case "c":
            return parseEnum("MIDType", 2);
        case "s":
            return parseEnum("MIDType", 3);
        case "m":
            return parseEnum("MIDType", 4);
        case "p":
            return parseEnum("MIDType", 5);
        case "v":
            return parseEnum("MIDType", 6);
        default:
            return null;
    }
}
function toBit(num) {
    let i = 0;
    const nums = [];
    while (1 << i <= num) {
        nums.push(((1 << i) & num) >> i);
        i++;
    }
    return nums;
}
export class Note {
    constructor(_mid, client) {
        this.client = client;
    }
    createPost(options) {
        options.homeId = this.mid;
        return this.client.timeline.createPost(options);
    }
    deletePost(options) {
        options.homeId = this.mid;
        return this.client.timeline.deletePost(options);
    }
    listPost(options = {}) {
        options.homeId = this.mid;
        return this.client.timeline.listPost(options);
    }
    getPost(options) {
        options.homeId = this.mid;
        return this.client.timeline.getPost(options);
    }
    sharePost(options) {
        options.homeId = this.mid;
        return this.client.timeline.sharePost(options);
    }
}
/**
 * @description LINE user (contact) utils
 */
export class User extends TypedEventEmitter {
    /**
     * @description Generate from mid.
     */
    static async from(mid, client) {
        if (mid === client.profile?.mid) {
            return new this({
                ...(await client.talk.getContactsV2({ mids: [mid] }))
                    .contacts[mid],
                contact: await client.talk.getContact({ mid }),
            }, client);
        }
        return new this((await client.talk.getContactsV2({ mids: [mid] })).contacts[mid], client);
    }
    constructor(contactEntry, client) {
        super();
        this.client = client;
        this.groupStatus = {};
        const { contact } = contactEntry;
        this.rawSource = contact;
        this.mid = contact.mid;
        this.createdTime = new Date(contact.createdTime * 1000);
        this.type = contact.type;
        this.status = contact.status;
        this.relation = contact.relation;
        this.displayName = contact.displayName;
        this.phoneticName = contact.phoneticName;
        this.pictureStatus = contact.pictureStatus;
        this.thumbnailUrl = contact.thumbnailUrl;
        this.statusMessage = contact.statusMessage;
        this.displayNameOverridden = contact.displayNameOverridden;
        this.favoriteTime = new Date(contact.favoriteTime * 1000);
        this.capableVoiceCall = contact.capableVoiceCall;
        this.capableVideoCall = contact.capableVideoCall;
        this.capableMyhome = contact.capableMyhome;
        this.capableBuddy = contact.capableBuddy;
        this.attributes = contact.attributes;
        this.picturePath = contact.picturePath;
        this.recommendParams = contact.recommendParams;
        this.friendRequestStatus = contact.friendRequestStatus;
        this.musicProfile = contact.musicProfile;
        this.videoProfile = contact.videoProfile;
        this.statusMessageContentMetadata = contact.statusMessageContentMetadata;
        this.avatarProfile = contact.avatarProfile;
        this.friendRingtone = contact.friendRingtone;
        this.friendRingbackTone = contact.friendRingbackTone;
        this.nftProfile = contact.nftProfile;
        this.pictureSource = contact.pictureSource;
    }
    /**
     * @description Send msg to user.
     */
    send(options) {
        if (typeof options === "string") {
            return this.send({ text: options });
        }
        else {
            const _options = options;
            _options.to = this.mid;
            return this.client.talk.sendMessage(_options);
        }
    }
    /**
     * @description Kickout from group.
     */
    kick(chatMid) {
        return this.client.talk.deleteOtherFromChat({
            request: {
                targetUserMids: [this.mid],
                chatMid,
            },
        });
    }
    /**
     * @description Invite to group.
     */
    async invite(chatMid) {
        await this.client.talk.inviteIntoChat({
            chatMid,
            targetUserMids: [this.mid],
        });
    }
    /**
     * @description Add to friend.
     */
    async addFriend() {
        return await this.client.relation.addFriendByMid({ mid: this.mid });
    }
    isMe() {
        return this.client.profile?.mid === this.mid;
    }
}
/**
 * @description LINE group (chat) utils
 */
export class Group extends TypedEventEmitter {
    /**
     * @description Generate from groupMid or {Chat}.
     */
    static async from(gidOrChat, client) {
        const chat = typeof gidOrChat === "string"
            ? await client.talk.getChat({ chatMid: gidOrChat })
            : gidOrChat;
        const creator = await User.from(chat.extra.groupExtra.creator, client);
        const _members = (await client.talk.getContactsV2({
            mids: Object.keys(chat.extra.groupExtra.memberMids),
        })).contacts;
        const members = [];
        for (const key in _members) {
            if (Object.prototype.hasOwnProperty.call(_members, key)) {
                let user;
                if (key === client.profile?.mid) {
                    user = new User({
                        ..._members[key],
                        contact: await client.talk.getContact({ mid: key }),
                    }, client);
                }
                else {
                    user = new User(_members[key], client);
                }
                user.groupStatus.joinedAt = new Date(chat.extra.groupExtra.memberMids[key] * 1000);
                members.push();
            }
        }
        const _invitee = (await client.talk.getContactsV2({
            mids: Object.keys(chat.extra.groupExtra.inviteeMids),
        })).contacts;
        const invitee = [];
        for (const key in _invitee) {
            if (Object.prototype.hasOwnProperty.call(_invitee, key)) {
                let user;
                if (key === client.profile?.mid) {
                    user = new User({
                        ..._invitee[key],
                        contact: await client.talk.getContact({ mid: key }),
                    }, client);
                }
                else {
                    user = new User(_invitee[key], client);
                }
                user.groupStatus.invitedAt = new Date(chat.extra.groupExtra.inviteeMids[key] * 1000);
                user.kick = user.kick.bind(user, chat.chatMid);
                members.push();
            }
        }
        return new this(chat, client, creator, members, invitee);
    }
    constructor(chat, client, _creator, _members, _invitee) {
        super();
        this.client = client;
        this.rawSource = chat;
        this.mid = chat.chatMid;
        this.createdTime = new Date(chat.createdTime * 1000);
        this.name = chat.chatName;
        this.picturePath = chat.picturePath;
        this.notificationDisabled = chat.notificationDisabled;
        const { groupExtra } = chat.extra;
        this.preventedJoinByTicket = groupExtra.preventedJoinByTicket;
        this.invitationTicket = groupExtra.invitationTicket;
        this.note = new Note(this.mid, client);
        // client.on("message",(msg)=>msg.to===this.mid:this.emit("message",msg)?undefined)
    }
    /**
     * @description Send msg to group.
     */
    async send(options) {
        if (typeof options === "string") {
            return await this.send({ text: options });
        }
        else {
            const _options = options;
            _options.to = this.mid;
            return await this.client.talk.sendMessage(_options);
        }
    }
    /**
     * @description Update group status.
     */
    async set(options) {
        const _options = options;
        _options.chatMid = this.mid;
        return await this.client.talk.updateChat(_options);
    }
    /**
     * @description Update group name.
     */
    async setName(name) {
        return await this.set({
            chatSet: { chatName: name },
            updatedAttribute: "NAME",
        });
    }
    /**
     * @description Invite user.
     */
    async invite(mids) {
        return await this.client.talk.inviteIntoChat({
            targetUserMids: mids,
            chatMid: this.mid,
        });
    }
    /**
     * @description Kickout user.
     */
    kick(mid) {
        return this.client.talk.deleteOtherFromChat({
            request: {
                targetUserMids: [mid],
                chatMid: this.mid,
            },
        });
    }
}
/**
 * @description LINE talk event utils
 */
export class Operation {
    constructor(source, client) {
        this.reqSeq = 0;
        this.param = {};
        this.rawSource = source;
        this.client = client;
        this.revision = source.revision;
        this.checksum = source.checksum;
        this.createdTime = new Date(source.createdTime * 1000);
        this.type = parseEnum("OpType", source.type) ||
            source.type;
        this.reqSeq = source.reqSeq;
        this.status = parseEnum("Pb1_EnumC13127p6", source.status) ||
            source.status;
        this.param = {
            1: source.param1,
            2: source.param2,
            3: source.param3,
        };
        if (source.type === "RECEIVE_MESSAGE" ||
            source.type === "SEND_MESSAGE" ||
            source.type === "SEND_CONTENT") {
            this.message = new TalkMessage({ message: source.message }, client);
        }
        if (source.type == "SEND_CHAT_REMOVED") {
            this.event = new SendChatRemoved(this);
        }
        else if (source.type == "SEND_CHAT_CHECKED") {
            this.event = new SendChatChecked(this);
        }
        else if (source.type == "NOTIFIED_READ_MESSAGE") {
            this.event = new NotifiedReadMessage(this);
        }
        else if (source.type == "NOTIFIED_SEND_REACTION") {
            this.event = new NotifiedSendReaction(this);
        }
        else if (source.type == "SEND_REACTION") {
            this.event = new SendReaction(this);
        }
        else if (source.type == "NOTIFIED_UPDATE_PROFILE") {
            this.event = new NotifiedUpdateProfile(this);
        }
        else if (source.type == "NOTIFIED_UPDATE_PROFILE_CONTENT") {
            this.event = new NotifiedUpdateProfileContent(this);
        }
        else if (source.type == "DESTROY_MESSAGE") {
            this.event = new DestroyMessage(this);
        }
        else if (source.type == "NOTIFIED_DESTROY_MESSAGE") {
            this.event = new NotifiedDestroyMessage(this);
        }
        else if (source.type == "NOTIFIED_JOIN_CHAT") {
            this.event = new NotifiedJoinChat(this);
        }
        else if (source.type == "NOTIFIED_ACCEPT_CHAT_INVITATION") {
            this.event = new NotifiedAcceptChatInvitation(this);
        }
        else if (source.type == "INVITE_INTO_CHAT") {
            this.event = new InviteIntoChat(this);
        }
        else if (source.type == "DELETE_SELF_FROM_CHAT") {
            this.event = new DeleteSelfFromChat(this);
        }
        else if (source.type == "NOTIFIED_LEAVE_CHAT") {
            this.event = new NotifiedLeaveChat(this);
        }
        else if (source.type == "DELETE_OTHER_FROM_CHAT") {
            this.event = new DeleteOtherFromChat(this);
        }
        else if (source.type == "NOTIFIED_DELETE_OTHER_FROM_CHAT") {
            this.event = new DeleteOtherFromChat(this);
        }
    }
}
/**
 * @description you unsend the message
 */
export class DestroyMessage {
    constructor(op) {
        this.type = "DestroyMessage";
        if (op.type !== "DESTROY_MESSAGE") {
            throw new TypeError("Wrong operation type");
        }
        if (typeof op.param[1] === "undefined" ||
            typeof op.param[2] === "undefined") {
            throw new TypeError("Wrong param");
        }
        this.messageId = op.param[2];
        this.chatMid = op.param[1];
    }
}
/**
 * @description the user unsend the message
 */
export class NotifiedDestroyMessage {
    constructor(op) {
        this.type = "NotifiedDestroyMessage";
        if (op.type !== "NOTIFIED_DESTROY_MESSAGE") {
            throw new TypeError("Wrong operation type");
        }
        if (typeof op.param[1] === "undefined" ||
            typeof op.param[2] === "undefined") {
            throw new TypeError("Wrong param");
        }
        this.messageId = op.param[2];
        this.chatMid = op.param[1];
    }
}
/**
 * @description the user joined the chat
 */
export class NotifiedJoinChat {
    constructor(op) {
        this.type = "NotifiedJoinChat";
        if (op.type !== "NOTIFIED_JOIN_CHAT") {
            throw new TypeError("Wrong operation type");
        }
        if (typeof op.param[1] === "undefined" ||
            typeof op.param[2] === "undefined") {
            throw new TypeError("Wrong param");
        }
        this.userMid = op.param[2];
        this.chatMid = op.param[1];
    }
}
/**
 * @description the user accepted the chat invitation
 */
export class NotifiedAcceptChatInvitation {
    constructor(op) {
        this.type = "NotifiedAcceptChatInvitation";
        if (op.type !== "NOTIFIED_ACCEPT_CHAT_INVITATION") {
            throw new TypeError("Wrong operation type");
        }
        if (typeof op.param[1] === "undefined" ||
            typeof op.param[2] === "undefined") {
            throw new TypeError("Wrong param");
        }
        this.userMid = op.param[2];
        this.chatMid = op.param[1];
    }
}
/**
 * @description the user was invited into chat by you
 */
export class InviteIntoChat {
    constructor(op) {
        this.type = "InviteIntoChat";
        if (op.type !== "INVITE_INTO_CHAT") {
            throw new TypeError("Wrong operation type");
        }
        if (typeof op.param[1] === "undefined" ||
            typeof op.param[2] === "undefined") {
            throw new TypeError("Wrong param");
        }
        this.userMid = op.param[2];
        this.chatMid = op.param[1];
    }
}
/**
 * @description you left the chat
 */
export class DeleteSelfFromChat {
    constructor(op) {
        this.type = "DeleteSelfFromChat";
        if (op.type !== "DELETE_SELF_FROM_CHAT") {
            throw new TypeError("Wrong operation type");
        }
        if (typeof op.param[1] === "undefined") {
            throw new TypeError("Wrong param");
        }
        this.chatMid = op.param[1];
    }
}
/**
 * @description the user left (kicked) the chat
 */
export class NotifiedLeaveChat {
    constructor(op) {
        this.type = "NotifiedLeaveChat";
        if (op.type !== "NOTIFIED_LEAVE_CHAT") {
            throw new TypeError("Wrong operation type");
        }
        if (typeof op.param[1] === "undefined" ||
            typeof op.param[2] === "undefined") {
            throw new TypeError("Wrong param");
        }
        this.userMid = op.param[2];
        this.chatMid = op.param[1];
    }
}
/**
 * @description the other user was kicked from chat by you
 */
export class DeleteOtherFromChat {
    constructor(op) {
        this.type = "DeleteOtherFromChat";
        if (op.type !== "DELETE_OTHER_FROM_CHAT") {
            throw new TypeError("Wrong operation type");
        }
        if (typeof op.param[1] === "undefined" ||
            typeof op.param[2] === "undefined") {
            throw new TypeError("Wrong param");
        }
        this.userMid = op.param[2];
        this.chatMid = op.param[1];
    }
}
/**
 * @description the profile content was updated by user
 */
export class NotifiedUpdateProfileContent {
    constructor(op) {
        this.type = "NotifiedUpdateProfileContent";
        this.profileAttributes = [];
        if (op.type !== "NOTIFIED_UPDATE_PROFILE_CONTENT") {
            throw new TypeError("Wrong operation type");
        }
        if (typeof op.param[1] === "undefined" ||
            typeof op.param[2] === "undefined") {
            throw new TypeError("Wrong param");
        }
        this.userMid = op.param[1];
        const attr = parseEnum("ProfileAttribute", op.param[2]);
        if (attr !== null) {
            this.profileAttributes[0] = attr;
        }
        else {
            const arr = [];
            toBit(parseInt(op.param[2])).forEach((e, i) => {
                if (e === 1) {
                    arr.push(parseEnum("ProfileAttribute", 2 ** i));
                }
            });
            this.profileAttributes = arr;
        }
    }
}
/**
 * @description the profile was updated by user
 */
export class NotifiedUpdateProfile {
    constructor(op) {
        this.type = "NotifiedUpdateProfile";
        this.profileAttributes = [];
        this.info = {};
        if (op.type !== "NOTIFIED_UPDATE_PROFILE") {
            throw new TypeError("Wrong operation type");
        }
        if (typeof op.param[1] === "undefined" ||
            typeof op.param[2] === "undefined" ||
            typeof op.param[3] === "undefined") {
            throw new TypeError("Wrong param");
        }
        this.userMid = op.param[1];
        const attr = parseEnum("ProfileAttribute", op.param[2]);
        if (attr !== null) {
            this.profileAttributes[0] = attr;
        }
        else {
            const arr = [];
            toBit(parseInt(op.param[2])).forEach((e, i) => {
                if (e === 1) {
                    arr.push(parseEnum("ProfileAttribute", 2 ** i));
                }
            });
            this.profileAttributes = arr;
        }
        this.info = JSON.parse(op.param[3]);
    }
}
/**
 * @description the profile was updated by you
 */
export class UpdateProfile {
    constructor(op) {
        this.type = "UpdateProfile";
        this.profileAttributes = [];
        this.info = {};
        if (op.type !== "UPDATE_PROFILE") {
            throw new TypeError("Wrong operation type");
        }
        if (typeof op.param[1] === "undefined" ||
            typeof op.param[2] === "undefined") {
            throw new TypeError("Wrong param");
        }
        const attr = parseEnum("ProfileAttribute", op.param[1]);
        if (attr !== null) {
            this.profileAttributes[0] = attr;
        }
        else {
            const arr = [];
            toBit(parseInt(op.param[1])).forEach((e, i) => {
                if (e === 1) {
                    arr.push(parseEnum("ProfileAttribute", 2 ** i));
                }
            });
            this.profileAttributes = arr;
        }
        this.info = JSON.parse(op.param[2]);
    }
}
/**
 * @description the message was reacted by ypu
 */
export class SendReaction {
    constructor(op) {
        this.type = "SendReaction";
        if (op.type !== "SEND_REACTION") {
            throw new TypeError("Wrong operation type");
        }
        if (typeof op.param[1] === "undefined" ||
            typeof op.param[2] === "undefined") {
            throw new TypeError("Wrong param");
        }
        this.messageId = op.param[1];
        const data = JSON.parse(op.param[2]);
        this.chatMid = data.chatMid;
        this.chatType = getMidType(this.chatMid);
        this.reactionType = parseEnum("MessageReactionType", data.curr.predefinedReactionType);
    }
}
/**
 * @description the message was reacted by user
 */
export class NotifiedSendReaction {
    constructor(op) {
        this.type = "NotifiedSendReaction";
        if (op.type !== "NOTIFIED_SEND_REACTION") {
            throw new TypeError("Wrong operation type");
        }
        if (typeof op.param[1] === "undefined" ||
            typeof op.param[2] === "undefined" ||
            typeof op.param[3] === "undefined") {
            throw new TypeError("Wrong param");
        }
        this.messageId = op.param[1];
        this.userMid = op.param[3];
        const data = JSON.parse(op.param[2]);
        this.chatMid = data.chatMid;
        this.chatType = getMidType(this.chatMid);
        this.reactionType = parseEnum("MessageReactionType", data.curr.predefinedReactionType);
    }
}
/**
 * @description the message was read by user
 */
export class NotifiedReadMessage {
    constructor(op) {
        this.type = "NotifiedReadMessage";
        if (op.type !== "NOTIFIED_READ_MESSAGE") {
            throw new TypeError("Wrong operation type");
        }
        if (typeof op.param[1] === "undefined" ||
            typeof op.param[2] === "undefined" ||
            typeof op.param[3] === "undefined") {
            throw new TypeError("Wrong param");
        }
        this.chatMid = op.param[1];
        this.userMid = op.param[2];
        this.messageId = op.param[3];
        this.chatType = getMidType(op.param[1]);
    }
}
/**
 * @description the message was read by you
 */
export class SendChatChecked {
    constructor(op) {
        this.type = "SendChatChecked";
        if (op.type !== "SEND_CHAT_CHECKED") {
            throw new TypeError("Wrong operation type");
        }
        if (typeof op.param[1] === "undefined" ||
            typeof op.param[2] === "undefined") {
            throw new TypeError("Wrong param");
        }
        this.chatMid = op.param[1];
        this.messageId = op.param[2];
        this.chatType = getMidType(op.param[1]);
    }
}
/**
 * @description the chatroom history was removed by you
 */
export class SendChatRemoved {
    constructor(op) {
        this.type = "SendChatRemoved";
        if (op.type !== "SEND_CHAT_REMOVED") {
            throw new TypeError("Wrong operation type");
        }
        if (typeof op.param[1] === "undefined" ||
            typeof op.param[2] === "undefined") {
            throw new TypeError("Wrong param");
        }
        this.chatMid = op.param[1];
        this.messageId = op.param[2];
        this.chatType = getMidType(op.param[1]);
    }
}
//# sourceMappingURL=talk-class.js.map