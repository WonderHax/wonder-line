import type { BaseClient } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/linejs/base/core/mod.ts";
import type { ProtocolKey } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/linejs/base/thrift/mod.ts";
export interface BaseService {
    client: BaseClient;
    protocolType: ProtocolKey;
    requestPath: string;
    errorName: string;
}
//# sourceMappingURL=types.d.ts.map