import type { BaseClient } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/mod.ts";
import { Square, SquareChat } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/client/features/square/mod.ts";
import { Chat } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/client/features/chat/mod.ts";
import { User } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/client/features/user/mod.ts";
import { TypedEventEmitter } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/core/typed-event-emitter/index.ts";
import { SquareMessage, TalkMessage } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/client/features/message/mod.ts";
import type * as LINETypes from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/line_types.ts";
export { Chat, Square, SquareChat, SquareMessage, TalkMessage, User };
export interface ListenOptions {
    /**
     * A boolean of whether to enable receiving talk events.
     * @default true
     */
    talk?: boolean;
    /**
     * A boolean of whether to enable receiving square (OpenChat) events.
     * @default false
     */
    square?: boolean;
    /**
     * A AbortSignal to stop listening.
     */
    signal?: AbortSignal;
}
export type ClientEvents = {
    message: (message: TalkMessage) => void;
    event: (event: LINETypes.Operation) => void;
    "square:message": (message: SquareMessage) => void;
    "square:event": (event: LINETypes.SquareEvent) => void;
};
export declare class Client extends TypedEventEmitter<ClientEvents> {
    readonly base: BaseClient;
    constructor(base: BaseClient);
    /**
     * Listens events.
     * @param opts Options
     * @returns TypedEventEmitter
     */
    listen(opts?: ListenOptions): void;
    /** Gets auth token for LINE. */
    get authToken(): string;
    /**
     * Fetches all chat rooms the user joined.
     */
    fetchJoinedChats(): Promise<Chat[]>;
    /**
     * Fetches all friend.
     */
    fetchUsers(): Promise<User[]>;
    /**
     * Fetches all squares the user joined.
     */
    fetchJoinedSquares(): Promise<Square[]>;
    /**
     * Fetches all square chats the user joined.
     */
    fetchJoinedSquareChats(): Promise<SquareChat[]>;
    /**
     * Gets user by mid.
     * @param mid User mid
     * @returns User
     */
    getUser(mid: string): Promise<User>;
    /**
     * Gets chat by mid.
     * @param chatMid Chat mid
     * @returns Chat
     */
    getChat(chatMid: string): Promise<Chat>;
    /**
     * Gets square by mid.
     * @param squareMid Square mid
     * @returns Square
     */
    getSquare(squareMid: string): Promise<Square>;
    /**
     * Gets square by mid.
     * @param squareChatMid Square chat mid
     * @returns SquareChat
     */
    getSquareChat(squareChatMid: string): Promise<SquareChat>;
}
//# sourceMappingURL=client.d.ts.map