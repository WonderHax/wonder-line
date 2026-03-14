import type { Client } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/linejs/packages/linejs/client/client.ts";
import type { Chat } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/linejs/packages/linejs/client/features/chat/mod.ts";
import type * as line from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/line_types.ts";
import { TalkMessage } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/linejs/packages/linejs/client/features/message/mod.ts";

export interface MessageFetcher {
	fetch: (limit: number) => Promise<TalkMessage[]>;
}
export const createMessageFetcher = async (client: Client, chat: Chat) => {
	const boxes = await client.base.talk.getMessageBoxes({
		messageBoxListRequest: {},
	});
	const box = boxes.messageBoxes.find((box) => box.id === chat.mid);
	if (!box) {
		throw new Error("Message box not found.");
	}

	let lastMessageId: line.MessageBoxV2MessageId = box.lastDeliveredMessageId;
	return {
		async fetch(limit: number) {
			const messages = await client.base.talk.getPreviousMessagesV2WithRequest({
				request: {
					messageBoxId: box.id,
					endMessageId: lastMessageId,
					messagesCount: limit,
				},
			});
			const lastMessage = messages.at(-1)!;
			lastMessageId = {
				deliveredTime: lastMessage.deliveredTime,
				messageId: parseInt(lastMessage.id),
			};

			return await Promise.all(
				messages.map((message) => TalkMessage.fromRawTalk(message, client)),
			);
		},
	};
};
