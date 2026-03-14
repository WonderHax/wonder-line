import type { BaseClient } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/linejs/packages/linejs/base/core/mod.ts";
import type { ProtocolKey } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/linejs/packages/linejs/base/thrift/mod.ts";

export interface BaseService {
	client: BaseClient;
	protocolType: ProtocolKey;
	requestPath: string;
	errorName: string;
}
