import type { MIDType } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/line_types.ts";

export type MentionTarget = {
	all: true;
} | {
	all: false;
	mid: string;
};
export type DecorationsData = {
	text: string;
	emoji?: {
		productId: string;
		sticonId: string;
		version?: number;
		resourceType?: string;
		url?: string;
	};
	mention?:
		| {
			mid: string;
			all?: undefined;
		}
		| {
			mid?: undefined;
			all: boolean;
		};
};
export interface Mid {
	id: string;
	type: MIDType;
}
