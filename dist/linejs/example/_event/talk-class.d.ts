/**
 * Develop now
 * @experimental
 * for talk
 */
import type * as LINETypes from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/line_types.ts";
import type { BaseClient } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/example/core/mod.ts";
import type { Buffer } from "node:buffer";
import { TypedEventEmitter } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/example/core/typed-event-emitter/index.ts";
import { TalkMessage } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/example/_event/message-class.ts";
import type { TimelineResponse } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/example/timeline/mod.ts";
import type { LooseType } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/thrift.ts";
type GroupEvents = {
    message: (message: TalkMessage) => void;
    kick: (event: Operation & {
        event: DeleteOtherFromChat;
    }) => void;
    leave: (event: Operation & {
        event: NotifiedLeaveChat | DeleteSelfFromChat;
    }) => void;
};
type UserEvents = {
    message: (message: TalkMessage) => void;
    update: (event: Operation & {
        event: NotifiedUpdateProfile | NotifiedUpdateProfileContent;
    }) => void;
};
export declare class Note {
    private client;
    constructor(_mid: string, client: BaseClient);
    createPost(options: {
        text?: string;
        sharedPostId?: string;
        textSizeMode?: "AUTO" | "NORMAL";
        backgroundColor?: string;
        textAnimation?: "NONE" | "SLIDE" | "ZOOM" | "BUZZ" | "BOUNCE" | "BLINK";
        readPermissionType?: "ALL" | "FRIEND" | "GROUP" | "EVENT" | "NONE";
        readPermissionGids?: string[];
        holdingTime?: number;
        stickerIds?: string[];
        stickerPackageIds?: string[];
        locationLatitudes?: number[];
        locationLongitudes?: number[];
        locationNames?: string[];
        mediaObjectIds?: string[];
        mediaObjectTypes?: string[];
        sourceType?: string;
    }): Promise<TimelineResponse>;
    deletePost(options: {
        postId: string;
    }): Promise<TimelineResponse>;
    listPost(options?: {
        homeId?: string;
        postId?: string;
        updatedTime?: number;
        sourceType?: string;
    }): Promise<TimelineResponse>;
    getPost(options: {
        postId: string;
    }): Promise<TimelineResponse>;
    sharePost(options: {
        postId: string;
        chatMid: string;
    }): Promise<TimelineResponse>;
}
/**
 * @description LINE user (contact) utils
 */
export declare class User extends TypedEventEmitter<UserEvents> {
    private client;
    rawSource: LINETypes.Contact;
    mid: string;
    createdTime: Date;
    type: LINETypes.ContactType;
    status: LINETypes.ContactStatus;
    relation: LINETypes.ContactRelation;
    displayName: string;
    phoneticName: string;
    pictureStatus: string;
    thumbnailUrl: string;
    statusMessage: string;
    displayNameOverridden: string;
    favoriteTime: Date;
    capableVoiceCall: boolean;
    capableVideoCall: boolean;
    capableMyhome: boolean;
    capableBuddy: boolean;
    attributes: number;
    picturePath: string;
    recommendParams: string;
    friendRequestStatus: LINETypes.FriendRequestStatus;
    musicProfile: string;
    videoProfile: string;
    statusMessageContentMetadata: {
        [k: string]: string;
    };
    avatarProfile: LINETypes.AvatarProfile;
    friendRingtone: string;
    friendRingbackTone: string;
    nftProfile: boolean;
    pictureSource: LINETypes.Pb1_N6;
    groupStatus: Record<string, LooseType> & {
        joinedAt?: Date;
        invitedAt?: Date;
    };
    /**
     * @description Generate from mid.
     */
    static from(mid: string, client: BaseClient): Promise<User>;
    constructor(contactEntry: LINETypes.ContactEntry, client: BaseClient);
    /**
     * @description Send msg to user.
     */
    send(options: string | {
        text?: string;
        contentType?: number;
        contentMetadata?: LooseType;
        relatedMessageId?: string;
        location?: LINETypes.Location;
        chunk?: string[] | Buffer[];
        e2ee?: boolean;
    }): Promise<LINETypes.Message>;
    /**
     * @description Kickout from group.
     */
    kick(chatMid: string): Promise<LINETypes.Pb1_M3>;
    /**
     * @description Invite to group.
     */
    invite(chatMid: string): Promise<void>;
    /**
     * @description Add to friend.
     */
    addFriend(): Promise<LooseType>;
    isMe(): boolean;
}
/**
 * @description LINE group (chat) utils
 */
export declare class Group extends TypedEventEmitter<GroupEvents> {
    private client;
    rawSource: LINETypes.Chat;
    mid: string;
    createdTime: Date;
    name: string;
    picturePath: string;
    preventedJoinByTicket: boolean;
    invitationTicket: string;
    notificationDisabled: boolean;
    note: Note;
    /**
     * @description Generate from groupMid or {Chat}.
     */
    static from(gidOrChat: string | LINETypes.Chat, client: BaseClient): Promise<Group>;
    constructor(chat: LINETypes.Chat, client: BaseClient, _creator: User, _members: User[], _invitee: User[]);
    /**
     * @description Send msg to group.
     */
    send(options: string | {
        text?: string;
        contentType?: number;
        contentMetadata?: LooseType;
        relatedMessageId?: string;
        location?: LINETypes.Location;
        chunk?: string[] | Buffer[];
        e2ee?: boolean;
    }): Promise<LINETypes.Message>;
    /**
     * @description Update group status.
     */
    set(options: {
        chatSet: Partial<LINETypes.Chat>;
        updatedAttribute: LINETypes.Pb1_O2;
    }): Promise<LINETypes.Pb1_Zc>;
    /**
     * @description Update group name.
     */
    setName(name: string): Promise<LINETypes.Pb1_Zc>;
    /**
     * @description Invite user.
     */
    invite(mids: string[]): Promise<LINETypes.Pb1_J5>;
    /**
     * @description Kickout user.
     */
    kick(mid: string): Promise<LINETypes.Pb1_M3>;
}
/**
 * @description LINE talk event utils
 */
export declare class Operation {
    rawSource: LINETypes.Operation;
    protected client?: BaseClient;
    message?: TalkMessage;
    revision: number;
    createdTime: Date;
    type: LINETypes.OpType;
    reqSeq: number;
    checksum?: string;
    status?: "ALERT_DISABLED" | LINETypes.Pb1_EnumC13127p6;
    param: {
        1?: string;
        2?: string;
        3?: string;
    };
    event?: SendChatRemoved | SendChatChecked | NotifiedReadMessage | NotifiedSendReaction | SendReaction | NotifiedUpdateProfile | NotifiedUpdateProfileContent | DestroyMessage | NotifiedDestroyMessage | NotifiedJoinChat | NotifiedAcceptChatInvitation | InviteIntoChat | DeleteSelfFromChat | NotifiedLeaveChat | DeleteOtherFromChat;
    constructor(source: LINETypes.Operation, client: BaseClient);
}
/**
 * @description you unsend the message
 */
export declare class DestroyMessage {
    readonly type: string;
    messageId: string;
    chatMid: string;
    constructor(op: Operation);
}
/**
 * @description the user unsend the message
 */
export declare class NotifiedDestroyMessage {
    readonly type: string;
    messageId: string;
    chatMid: string;
    constructor(op: Operation);
}
/**
 * @description the user joined the chat
 */
export declare class NotifiedJoinChat {
    readonly type: string;
    userMid: string;
    chatMid: string;
    constructor(op: Operation);
}
/**
 * @description the user accepted the chat invitation
 */
export declare class NotifiedAcceptChatInvitation {
    readonly type: string;
    userMid: string;
    chatMid: string;
    constructor(op: Operation);
}
/**
 * @description the user was invited into chat by you
 */
export declare class InviteIntoChat {
    readonly type: string;
    userMid: string;
    chatMid: string;
    constructor(op: Operation);
}
/**
 * @description you left the chat
 */
export declare class DeleteSelfFromChat {
    readonly type: string;
    chatMid: string;
    constructor(op: Operation);
}
/**
 * @description the user left (kicked) the chat
 */
export declare class NotifiedLeaveChat {
    readonly type: string;
    userMid: string;
    chatMid: string;
    constructor(op: Operation);
}
/**
 * @description the other user was kicked from chat by you
 */
export declare class DeleteOtherFromChat {
    readonly type: string;
    userMid: string;
    chatMid: string;
    constructor(op: Operation);
}
/**
 * @description the profile content was updated by user
 */
export declare class NotifiedUpdateProfileContent {
    readonly type: string;
    userMid: string;
    profileAttributes: (LINETypes.Pb1_K6 | null)[];
    constructor(op: Operation);
}
/**
 * @description the profile was updated by user
 */
export declare class NotifiedUpdateProfile {
    readonly type: string;
    userMid: string;
    profileAttributes: (LINETypes.Pb1_K6 | null)[];
    info: Record<string, LooseType>;
    constructor(op: Operation);
}
/**
 * @description the profile was updated by you
 */
export declare class UpdateProfile {
    readonly type: string;
    profileAttributes: (LINETypes.Pb1_K6 | null)[];
    info: Record<string, LooseType>;
    constructor(op: Operation);
}
/**
 * @description the message was reacted by ypu
 */
export declare class SendReaction {
    readonly type: string;
    chatMid: string;
    chatType: LINETypes.MIDType;
    messageId: string;
    reactionType: LINETypes.MessageReactionType;
    constructor(op: Operation);
}
/**
 * @description the message was reacted by user
 */
export declare class NotifiedSendReaction {
    readonly type: string;
    chatMid: string;
    chatType: LINETypes.MIDType;
    messageId: string;
    userMid: string;
    reactionType: LINETypes.MessageReactionType;
    constructor(op: Operation);
}
/**
 * @description the message was read by user
 */
export declare class NotifiedReadMessage {
    readonly type: string;
    chatMid: string;
    chatType: LINETypes.MIDType;
    messageId: string;
    userMid: string;
    constructor(op: Operation);
}
/**
 * @description the message was read by you
 */
export declare class SendChatChecked {
    readonly type: string;
    chatMid: string;
    chatType: LINETypes.MIDType;
    messageId: string;
    constructor(op: Operation);
}
/**
 * @description the chatroom history was removed by you
 */
export declare class SendChatRemoved {
    readonly type: string;
    chatMid: string;
    chatType: LINETypes.MIDType | null;
    messageId: string;
    constructor(op: Operation);
}
export {};
//# sourceMappingURL=talk-class.d.ts.map