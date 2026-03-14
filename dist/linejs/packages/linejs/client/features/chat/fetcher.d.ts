import type { Client } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/client/client.ts";
import type { Chat } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/client/features/chat/mod.ts";
import { TalkMessage } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/client/features/message/mod.ts";
export interface MessageFetcher {
    fetch: (limit: number) => Promise<TalkMessage[]>;
}
export declare const createMessageFetcher: (client: Client, chat: Chat) => Promise<{
    fetch(limit: number): Promise<any>;
}>;
//# sourceMappingURL=fetcher.d.ts.map