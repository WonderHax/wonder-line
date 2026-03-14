import type { Client } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/linejs/client/mod.ts";
import type * as line from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/line_types.ts";
import { TalkMessage } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/linejs/client/features/message/talk.ts";
import { type MessageFetcher } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/linejs/client/features/chat/fetcher.ts";
interface ChatInit {
    client: Client;
    raw: line.Chat;
}
/**
 * Talk chat(group) class (not a OpenChat)
 */
export declare class Chat {
    #private;
    raw: line.Chat;
    readonly mid: string;
    name: string;
    constructor(init: ChatInit);
    /**
     * Sends message to the chat(group).
     */
    sendMessage(input: string | {
        text?: string;
        /**
         * If true, end2end encryption will be enabled.
         * @default true
         */
        e2ee?: boolean;
        /**
         * Related message mid. This is used for reply.
         */
        relatedMessageId?: string;
        contentType?: line.ContentType;
        contentMetadata?: Record<string, string>;
        location?: line.Location;
        chunk?: string[];
    }): Promise<TalkMessage>;
    /**
     * @description Update chat(group) status.
     */
    updateChat(options: {
        chat: Partial<line.Chat>;
        updatedAttribute: line.Pb1_O2;
    }): Promise<line.Pb1_Zc>;
    /**
     * @description Update chat(group) name.
     */
    updateName(name: string): Promise<line.Pb1_Zc>;
    /**
     * @description Invite user.
     */
    invite(mids: string[]): Promise<line.Pb1_J5>;
    /**
     * @description Kickout user.
     */
    kick(mid: string): Promise<line.Pb1_M3>;
    /**
     * @description Leave chat.
     */
    leave(): Promise<line.Pb1_M3>;
    /**
     * Fetches messages from the chat(group).
     *
     * @param limit The number of messages to fetch. Defaults to 10.
     * @returns A promise that resolves to an array of TalkMessage instances.
     */
    fetchMessages(limit?: number): Promise<TalkMessage[]>;
    messageFetcher(): Promise<MessageFetcher>;
}
export {};
//# sourceMappingURL=mod.d.ts.map