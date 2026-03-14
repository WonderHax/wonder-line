import type { LooseType } from "https://raw.githubusercontent.com/wonderhax/wonder-line/main/linejs/packages/types/thrift.ts";
export declare class InternalError extends Error {
    readonly type: string;
    readonly message: string;
    readonly data: Record<string, LooseType>;
    constructor(type: string, message: string, data?: Record<string, LooseType>);
}
//# sourceMappingURL=error.d.ts.map