export { Protocols, } from "./readwrite/declares.ts";
export * as LINEStruct from "./readwrite/struct.ts";
import { ThriftRenameParser } from "./rename/parser.ts";
import { readThrift, readThriftStruct } from "./readwrite/read.ts";
import { writeThrift } from "./readwrite/write.ts";
/**
 * Thrift Client
 */
export class Thrift extends ThriftRenameParser {
    constructor() {
        super();
    }
    readThrift(...params) {
        return readThrift(...params);
    }
    readThriftStruct(...params) {
        return readThriftStruct(...params);
    }
    writeThrift(...params) {
        return writeThrift(...params);
    }
}
//# sourceMappingURL=mod.js.map