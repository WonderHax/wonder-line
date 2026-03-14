import * as thrift from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/thrift.ts";
import { Buffer } from "node:buffer";
import type { ParsedThrift } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/C:/Users/Admin/Documents/work/wonder-line/dist/linejs/packages/linejs/base/thrift/readwrite/declares.ts";
export declare function readThrift(data: Uint8Array | Buffer, Protocol?: typeof thrift.TCompactProtocol | typeof thrift.TBinaryProtocol): ParsedThrift;
export declare function readThriftStruct(data: Uint8Array | Buffer, Protocol?: typeof thrift.TCompactProtocol | typeof thrift.TBinaryProtocol): any;
//# sourceMappingURL=read.d.ts.map