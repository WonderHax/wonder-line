export {
	type NestedArray,
	type ParsedThrift,
	type ProtocolKey,
	Protocols,
} from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/Users/Admin/Documents/work/wonder-line/linejs/packages/linejs/base/thrift/readwrite/declares.ts";
export * as LINEStruct from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/Users/Admin/Documents/work/wonder-line/linejs/packages/linejs/base/thrift/readwrite/struct.ts";
import { ThriftRenameParser } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/Users/Admin/Documents/work/wonder-line/linejs/packages/linejs/base/thrift/rename/parser.ts";
import { readThrift, readThriftStruct } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/Users/Admin/Documents/work/wonder-line/linejs/packages/linejs/base/thrift/readwrite/read.ts";
import { writeThrift } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/Users/Admin/Documents/work/wonder-line/linejs/packages/linejs/base/thrift/readwrite/write.ts";

/**
 * Thrift Client
 */
export class Thrift extends ThriftRenameParser {
	constructor() {
		super();
	}
	readThrift(
		...params: Parameters<typeof readThrift>
	): ReturnType<typeof readThrift> {
		return readThrift(...params);
	}

	readThriftStruct(
		...params: Parameters<typeof readThriftStruct>
	): ReturnType<typeof readThriftStruct> {
		return readThriftStruct(...params);
	}

	writeThrift(
		...params: Parameters<typeof writeThrift>
	): ReturnType<typeof writeThrift> {
		return writeThrift(...params);
	}
}
