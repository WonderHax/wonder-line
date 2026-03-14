/**
 * Develop now
 * @experimental
 * for square
 */
import * as LINETypes from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/line_types.ts";
import { type BaseClient } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/example/core/mod.ts";
import { TypedEventEmitter } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/example/core/typed-event-emitter/index.ts";
import { SquareMessage } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/example/_event/message-class.ts";
import { Note } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/example/_event/talk-class.ts";
import type { LooseType } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/thrift.ts";
type SquareEvents = {
    "update:feature": (feature: LINETypes.SquareFeatureSet) => void;
    "update:status": (status: LINETypes.SquareStatus) => void;
    joinrequest: (joinrequest: LINETypes.SquareEventNotificationJoinRequest) => void;
    "update:note": (note: LINETypes.NoteStatus) => void;
    "update:authority": (authority: LINETypes.SquareAuthority) => void;
    "update:square": (square: LINETypes.Square) => void;
    update: (square: Square) => void;
    shutdown: (square: LINETypes.Square) => void;
};
type SquareChatEvents = {
    message: (message: SquareMessage) => void;
    update: (chat: SquareChat) => void;
    "update:chat": (chat: LINETypes.SquareChat) => void;
    "update:status": (status: LINETypes.SquareChatStatusWithoutMessage) => void;
    event: (event: LINETypes.SquareEvent) => void;
    "update:syncToken": (syncToken: string) => void;
};
type SquareMemberEvents = {
    message: (message: SquareMessage) => void;
};
/**
 * @description LINE square (Openchat) utils
 */
export declare class Square extends TypedEventEmitter<SquareEvents> {
    rawSouce: LINETypes.GetSquareResponse;
    private client;
    mid: string;
    name: string;
    profileImageObsHash: string;
    desc: string;
    searchable: boolean;
    type: LINETypes.SquareType;
    invitationURL: string;
    revision: number;
    state: LINETypes.SquareState;
    emblems: LINETypes.SquareEmblem[];
    joinMethod: LINETypes.SquareJoinMethod;
    createdAt: Date;
    me: SquareMember;
    authority: LINETypes.SquareAuthority;
    noteStatus: LINETypes.NoteStatus;
    status: LINETypes.SquareStatus;
    memberCount: number;
    joinRequestCount: number;
    lastJoinRequestAt: Date;
    openChatCount: number;
    feature: LINETypes.SquareFeatureSet;
    note: Note;
    constructor(rawSouce: LINETypes.GetSquareResponse, client: BaseClient, autoUpdate?: boolean);
    /**
     * @description Generate from mid.
     */
    static from(squareMid: string, client: BaseClient): Promise<Square>;
}
/**
 * @description LINE squareChat (Openchat) utils
 */
export declare class SquareChat extends TypedEventEmitter<SquareChatEvents> {
    rawSouce: LINETypes.GetSquareChatResponse;
    private client;
    mymid: string;
    mid: string;
    squareMid: string;
    type: LINETypes.SquareChatType;
    name: string;
    chatImageObsHash: string;
    squareChatRevision: number;
    maxMemberCount: number;
    state: LINETypes.SquareChatState;
    invitationUrl: string;
    messageVisibility: LINETypes.MessageVisibility;
    ableToSearchMessage: boolean | null;
    memberCount: number;
    status: LINETypes.SquareChatStatusWithoutMessage;
    syncToken?: string;
    note: Note;
    polling_delay: number;
    constructor(rawSouce: LINETypes.GetSquareChatResponse, client: BaseClient, polling?: boolean, autoUpdate?: boolean);
    /**
     * @description Generate from mid.
     */
    static from(squareChatMid: string, client: BaseClient, polling?: boolean): Promise<SquareChat>;
    getMembers(): Promise<SquareMember[]>;
    /**
     * @description Send msg to square.
     */
    send(options: string | {
        text?: string;
        contentType?: number;
        contentMetadata?: LooseType;
        relatedMessageId?: string;
        location?: LINETypes.Location;
    }): Promise<LINETypes.SendMessageResponse>;
    IS_POLLING: boolean;
    /**
     * @description start listen (fetchSquareChatEvents)
     */
    polling(): Promise<void>;
}
/**
 * @description LINE squareMember (Openchat user) utils
 */
export declare class SquareMember extends TypedEventEmitter<SquareMemberEvents> implements LINETypes.SquareMember {
    rawMember: LINETypes.SquareMember;
    private client;
    mid: string;
    squareMid: string;
    displayName: string;
    profileImageObsHash: string;
    ableToReceiveMessage: boolean;
    membershipState: LINETypes.SquareMembershipState;
    role: LINETypes.SquareMemberRole;
    revision: number;
    preference: LINETypes.SquarePreference;
    joinMessage: string;
    constructor(rawMember: LINETypes.SquareMember, client: BaseClient);
    /**
     * @description Generate from mid.
     */
    static from(squareMemberMid: string, client: BaseClient): Promise<SquareMember>;
}
export {};
//# sourceMappingURL=square-class.d.ts.map